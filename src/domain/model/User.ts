import { BaseEntity } from "./BaseEntity"

export type User  = {
    id: string | number
    name: string
    photo?: string
} & BaseEntity
