import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Space } from './space.entity';

@Entity('space_type')
export class SpaceType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // 예: '클럽', '카페', '공연장' 등

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Space, (space) => space.type)
  spaces: Space[];
}
