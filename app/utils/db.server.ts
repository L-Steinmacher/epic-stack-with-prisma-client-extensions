import { PrismaClient } from '@prisma/client'
import { singleton } from './singleton.server.ts'
import { NoteValidation } from '~/models/note.ts'

const prisma = singleton('prisma', () => new PrismaClient().$extends(NoteValidation))
prisma.$connect()

export { prisma }