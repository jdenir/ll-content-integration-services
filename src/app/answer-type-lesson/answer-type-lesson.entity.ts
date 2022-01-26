import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AnswerTypeEntity } from '../answer-type/answer-type.entity';

@Unique('fk_anwser_type_lesson_uniques', ['lessonId', 'resourceId', 'answerTypeId', 'eduModuleId'])
@Entity({ name: 'answer_type_lessons', orderBy: { createdAt: 'DESC' } })
export class AnswerTypeLessonEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'The id of answer type' })
  id: string;

  @Column({ type: 'varchar', nullable: false, name: 'lesson_id' })
  @ApiProperty({ description: 'The id of lesson' })
  lessonId: string;

  @Column({ type: 'varchar', nullable: false, name: 'resource_id' })
  @ApiProperty({ description: 'The id of resource' })
  resourceId: string;

  @Column({ type: 'varchar', nullable: false, name: 'answer_type_id' })
  @ApiProperty({ description: 'The id of answer type' })
  answerTypeId: string;

  @Column({ type: 'varchar', nullable: false, name: 'edu_module_id' })
  @ApiProperty({ description: 'The id of edu module' })
  eduModuleId: string;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty({ description: 'The create date of answer type' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty({ description: 'The update date of answer type' })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  @ApiProperty({ description: 'The delete date of answer type' })
  deletedAt: string;

  @ManyToOne(
    () => AnswerTypeEntity,
    answerType => answerType.answerTypeLessons,
    { nullable: false, cascade: true },
  )
  @JoinColumn({ name: 'answer_type_id', referencedColumnName: 'id' })
  answerType: AnswerTypeEntity;
}
