import { BaseEntity, Column, Entity, ManyToMany, OneToMany, PrimaryColumn } from 'typeorm'
import { Comment } from './Comment'
import { User } from './User'

@Entity()
export class Hike extends BaseEntity {
  @PrimaryColumn()
  id: number

  @Column('text')
  name: string

  @Column('text')
  summary: string

  @Column('float')
  stars: number

  @Column('text')
  difficulty: string

  @Column('text')
  location: string

  @Column('float')
  length: number

  @Column('float')
  latitude: number

  @Column('float')
  longitude: number

  @OneToMany(() => Comment, comment => comment.hike)
  comment: Comment[]

  @ManyToMany(() => User, user => user.id, { eager: false })
  favorites: User[]
}
