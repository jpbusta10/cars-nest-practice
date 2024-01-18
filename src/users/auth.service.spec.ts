import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', ()=>{
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async ()=>{
        const users: User[] = [];
        fakeUsersService = {
            find: (email) => {
                const filteredUsers = users.filter(user => user.email === email);
                return Promise.resolve(filteredUsers);
            },
            create: (email: string, password: string) => {
              const user = {id: Math.floor(Math.random()*999999),email, password } as User;
              users.push(user);
              return Promise.resolve(user);
            },
        }
    
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                }, 
            ]
        }).compile();
    
         service = module.get(AuthService);
    });
    
    it('can create an instance of this file', async ()=>{
        expect(service).toBeDefined();
    })
    it('crates a new user with salted and hashed password ', async ()=>{
        const user = await service.signup('asdiasf@asda.com', 'asdf'); 
        expect(user.password).not.toEqual('asdf');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    }),
    it('throws an error if user signs up with email that is in use', async () => {
        fakeUsersService.find = () => Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
        await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
          BadRequestException,
        );
      });
    it('throws if signin is call with an unused email', async () =>{
        await expect(
            service.signin('asdf@asdf.com', 'passdfkls'),
        ).rejects.toThrow(NotFoundException)
    })
    it('throws if an invalid password is provided', async ()=>{
        fakeUsersService.find = () => Promise.resolve([{id: 1, email: 'asdf@asdf.com', password: '1'} as User]);

        await expect(service.signin('asdf@asdf.com', '2')).rejects.toThrow(BadRequestException)
    })
     it('resturns a user if correct password is provides', async ()=>{

        await service.signup('asdf@asdf.com', 'mypassword');
        const user = await service.signin('asdf@asdf.com', 'mypassword');
        expect(user).toBeDefined();

     })
});

