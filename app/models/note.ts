import { z } from "zod";
import { Prisma } from "@prisma/client";
import { PriorityEnum } from "types/priority.ts";

// We declare the properties for the "Enum" as a POJO (Plain Old Javascript object) and make it immutable with the as const type decleration.


/*
* The type ObjectValues ObjectValues is a type alias that is used to convert the values of an object into a union type.
* It takes a generic parameter T, which represents the object type, and returns the union type of all the values in that object.
*/
type ObjectValues<T> = T[keyof T];
type priorityEnum = ObjectValues<typeof PriorityEnum>;

export type Note = {
    title: string;
    content: string;
    ownerId: string;
    priority:  priorityEnum;
}

/*
* We declare in the schema that hte priority is a zod enum and use the POJO PriorityEnum values to be validated.
*/
const noteSchema = z.object({
    title: z.string().min(5).max(100),
    content: z.string().min(5).max(1500),
    priority: z.enum(Object.values(PriorityEnum) as [string, ...string[]]),
    ownerId: z.string(),
}) satisfies z.Schema<Prisma.NoteUncheckedCreateInput>;

/*
* By defining this extension, you can ensure that the note entity data being created, updated,
* or upserted adheres to a specific schema or validation rules defined in the noteSchema object.
*/
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