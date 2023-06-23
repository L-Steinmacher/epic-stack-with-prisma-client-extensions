import { json, type DataFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { type PriorityEnum } from 'types/priority.ts'
import { GeneralErrorBoundary } from '~/components/error-boundary.tsx'
import { DeleteNote } from '~/routes/resources+/delete-note.tsx'
import { getUserId } from '~/utils/auth.server.ts'
import { prisma } from '~/utils/db.server.ts'
import { ButtonLink } from '~/utils/forms.tsx'

export async function loader({ request, params }: DataFunctionArgs) {
	const userId = await getUserId(request)
	const note = await prisma.note.findUnique({
		where: {
			id: params.noteId,
		},
		select: {
			id: true,
			title: true,
			content: true,
			ownerId: true,
			priority: true,
		},
	})
	if (!note) {
		throw new Response('Not found', { status: 404 })
	}
	return json({ note, isOwner: userId === note.ownerId })
}

export default function NoteRoute() {
	const data = useLoaderData<typeof loader>()
	type ObjectValues<T> = T[keyof T]
	type priority = ObjectValues<typeof PriorityEnum>
	// Even the type of the priority is checked with the enum
	// Try changeing on of the cases to something else and see what happens!
	function getColor(priority: priority) {
		switch(priority) {
		  case `Important!`:
			return 'text-red-500';
		  case 'Moderate':
			return 'text-yellow-500';
		  case 'Low':
			return 'text-green-500';
		  case 'Backlog':
			return 'text-blue-500';
		  default:
			return 'text-gray-500';
		}
	  }

	return (
		<div className="flex h-full flex-col">
			<div className="flex-grow">
				<h2 className="mb-2 text-h2 lg:mb-6">{data.note.title}</h2>
				<p className="text-sm md:text-lg">{data.note.content}</p>
				<p className={`text-sm md:text-lg ${getColor(data.note.priority as priority)}`}>{data.note.priority}</p>
			</div>
			{data.isOwner ? (
				<div className="flex justify-end gap-4">
					<DeleteNote id={data.note.id} />
					<ButtonLink size="md" variant="primary" to="edit">
						Edit
					</ButtonLink>
				</div>
			) : null}
		</div>
	)
}

export function ErrorBoundary() {
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				404: () => <p>Note not found</p>,
			}}
		/>
	)
}
