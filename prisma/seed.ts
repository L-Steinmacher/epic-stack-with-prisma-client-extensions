import fs from 'fs'
import { faker } from '@faker-js/faker'
import { createPassword, createUser } from 'tests/db-utils.ts'
import { prisma } from '~/utils/db.server.ts'
import { deleteAllData } from 'tests/setup/utils.ts'
import { getPasswordHash } from '~/utils/auth.server.ts'
import { PriorityEnum } from 'types/priority.ts'

async function seed() {
	console.log('🌱 Seeding...')
	console.time(`🌱 Database has been seeded`)

	console.time('🧹 Cleaned up the database...')
	deleteAllData()
	console.timeEnd('🧹 Cleaned up the database...')

	console.time(`👑 Created admin role/permission...`)
	const adminRole = await prisma.role.create({
		data: {
			name: 'admin',
			permissions: {
				create: { name: 'admin' },
			},
		},
	})
	console.timeEnd(`👑 Created admin role/permission...`)
	// hosts with ships and reviews
	// renters with bookings and reviews
	// hosts who are renters also
	const totalUsers = 40
	console.time(`👤 Created ${totalUsers} users...`)
	const users = await Promise.all(
		Array.from({ length: totalUsers }, async (_, index) => {
			const userData = createUser()
			const user = await prisma.user.create({
				data: {
					...userData,
					password: {
						create: createPassword(userData.username),
					},
					image: {
						create: {
							contentType: 'image/jpeg',
							file: {
								create: {
									blob: await fs.promises.readFile(
										`./tests/fixtures/images/user/${index % 10}.jpg`,
									),
								},
							},
						},
					},
					notes: {
						create: Array.from({
							length: faker.number.int({ min: 0, max: 10 }),
						}).map(() => {
							const note = {
							title: faker.lorem.sentence(),
							content: faker.lorem.paragraphs(),
							priority: faker.helpers.arrayElement(Object.values(PriorityEnum)),
							}
							return note;
							}),
					},
				},
			})
			return user
		}),
	)
	console.timeEnd(`👤 Created ${totalUsers} users...`)

	console.time(
		`🐨 Created user "kody" with the password "kodylovesyou" and admin role`,
	)
	// Type safety on the priority property as well as intellesense completion. Try changing the priority to an empty string and see the completion!
	const noteOne = {
		title:  'Basic Koala Facts',
		content:'Koalas are found in the eucalyptus forests of eastern Australia. They have grey fur with a cream-coloured chest, and strong, clawed feet, perfect for living in the branches of trees!',
		priority: "Moderate",
	}
	// You can access the PriorityEnum values in dot notation as bellow
	const noteTwo = {
		title: 'Koalas like to cuddle',
		content:
			'Cuddly critters, koalas measure about 60cm to 85cm long, and weigh about 14kg.',
		priority: PriorityEnum.MODERATE,
	}
	const noteThree = {
		title: 'Not bears',
		content:
			"Although you may have heard people call them koala 'bears', these awesome animals aren’t bears at all – they are in fact marsupials. A group of mammals, most marsupials have pouches where their newborns develop.",
		priority: 'Important!',
	}
	await prisma.user.create({
		data: {
			email: 'kody@kcd.dev',
			username: 'kody',
			name: 'Kody',
			roles: { connect: { id: adminRole.id } },
			image: {
				create: {
					contentType: 'image/png',
					file: {
						create: {
							blob: await fs.promises.readFile(
								'./tests/fixtures/images/user/kody.png',
							),
						},
					},
				},
			},
			password: {
				create: {
					hash: await getPasswordHash('kodylovesyou'),
				},
			},
			notes: {
				create: [
					noteOne,
					noteTwo,
					noteThree,
				],
			},
		},
	})
	console.timeEnd(
		`🐨 Created user "kody" with the password "kodylovesyou" and admin role`,
	)

	console.timeEnd(`🌱 Database has been seeded`)
}

seed()
	.catch(e => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})

/*
eslint
	@typescript-eslint/no-unused-vars: "off",
*/
