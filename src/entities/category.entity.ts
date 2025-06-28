import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Project } from './project.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // 예: '음악, 전시', '게임', '페스티벌'

  @Column({ nullable: true })
  description: string;

  @Column({ unique: true })
  value: string; // 예: 'music', 'game', 'festival'

  @OneToMany(() => Project, (project) => project.category)
  projects: Project[];
}
