import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm'
import Author from './Author'

@Entity()
export default class Book extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  title!: string

  @Column()
  publicationDate!: string

  @ManyToMany(() => Author, (author) => author.books)
  @JoinTable()
  authors!: Author[]
}
