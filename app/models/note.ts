import { z } from "zod";
import { Prisma } from "@prisma/client";

export const PriorityEnum = {
    IMPORTANT: "Important!",
    MODERATE: "Moderate",
    LOW: "Low",
    BACKLOG: "Backlog"
} as const;

type ObjectValues<T> = T[keyof T];
type priorityEnum = ObjectValues<typeof PriorityEnum>;

export type Note = {
    title: string;
    content: string;
    priority: priorityEnum;
}

const noteSchema = z.object({
    title: z.string().min(5).max(100),
    content: z.string().min(5).max(1500),
    priority: z.enum(Object.values(PriorityEnum) as [string, ...string[]]),
    ownerId: z.string(),
}) satisfies z.Schema<Prisma.NoteUncheckedCreateInput>;

export const NoteValidation = Prisma.defineExtension({
    query: {
        note: {
            create({ args, query }) {
                args.data = noteSchema.parse(args.data);
                return query(args);
            },
            update ({ args, query }) {
                args.data = noteSchema.partial().parse(args.data);
                return query(args);
            },
            updateMany ({ args, query }) {
                args.data = noteSchema.partial().parse(args.data);
                return query(args);
            },
            upsert ({ args, query }) {
                args.create = noteSchema.parse(args.create);
                args.update = noteSchema.partial().parse(args.update);
                return query(args)
            },
        }
    }
})