import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
} from 'typeorm'
import Book from './Book'

@Entity()
export default class Author extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  name!: string

  @Column()
  bio!: string

  @ManyToMany(() => Book, (book) => book.authors)
  books!: Book[]
}
