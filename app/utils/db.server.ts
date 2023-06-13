import { PrismaClient } from '@prisma/client'
import { singleton } from './singleton.server.ts'
import { NoteValidation } from '~/models/note.ts'

// We pass in the NoteValidation into the $extends client-level method
const prisma = singleton('prisma', () => new PrismaClient().$extends(NoteValidation))
prisma.$connect()

export { prisma }