import { Company } from "src/companies/entities/company.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum ClientStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}


@Entity({name: 'clients'})
export class Client {


    @PrimaryGeneratedColumn("uuid")
    id?: string;
    
    @Column({ name: "full_name", type: "varchar", length: 255 })
    fullName?: string;

    @Column({ type: "varchar", length: 255, unique: true })
    email?: string;
    
    @Column({ type: "varchar", length: 20, nullable: true })
    phone?: string | null;

    @Column({type:"varchar", nullable:true})
    position?: string | null;

    @Column({ type: "varchar", enum: ClientStatus, default: ClientStatus.ACTIVE })
    status?: ClientStatus;

    @Column({ type: "varchar", length: 255, nullable: true })
    notes?: string | null;


    @Column({
        name:"company_id",
        type:"uuid",
    
    })
    companyId?: string;


    @ManyToOne(()=> Company, (company) => company.clients, { onDelete: "RESTRICT",eager:true })
    @JoinColumn({ name: "company_id" })
    company?: Company;


    @CreateDateColumn({ name: "created_at", type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    createdAt?: Date;

    @UpdateDateColumn({ name: "updated_at", type: "datetime", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt?: Date;

}
