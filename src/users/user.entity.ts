
import { AfterInsert, AfterRemove, AfterUpdate, Entity, Column, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;
 
    @AfterInsert()
    logInsert(){
        console.log('inserted User with id:', this.id);
    }

    @AfterUpdate()
    logUpdate(){
        console.log('update user with id: ', this.id);
    }
    @AfterRemove()
    logRemove(){
        console.log('Remove User id: ', this.id);
        
    }
}