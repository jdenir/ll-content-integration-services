import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AnswerTypeLessonEntity } from '../answer-type-lesson/answer-type-lesson.entity';

@Entity({ name: 'answer_types', orderBy: { createdAt: 'DESC' } })
export class AnswerTypeEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'The id of answer type' })
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @ApiProperty({ description: 'The name of answer type' })
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty({ description: 'The create date of answer type' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty({ description: 'The update date of answer type' })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  @ApiProperty({ description: 'The delete date of answer type' })
  deletedAt: string;

  @OneToMany(
    () => AnswerTypeLessonEntity,
    answerTypeLesson => answerTypeLesson.answerType,
  )
  // @ApiProperty()
  answerTypeLessons: AnswerTypeLessonEntity[];
}
