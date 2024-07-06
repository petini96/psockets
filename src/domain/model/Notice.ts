import { BaseEntity } from "./BaseEntity"

export type Notice  = {
    id: string | number
    title: string
    message: string
} & BaseEntity
