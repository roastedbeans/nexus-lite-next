import { auth } from '@/auth';
import {
	Navbar,
	NavbarBrand,
	NavbarMenuToggle,
	NavbarMenu,
	NavbarMenuItem,
	NavbarContent,
	NavbarItem,
	Link,
} from '@nextui-org/react';
import LogoutButton from './LogoutButton';

export default async function NavbarComponent() {
	const session = await auth();
	const menuItems = ['Account', 'Logout'];

	return (
		<Navbar>
			<NavbarContent>
				<NavbarBrand>
					<p className='font-bold text-inherit'>NEXUSLITE</p>
				</NavbarBrand>
			</NavbarContent>

			<NavbarContent
				className='hidden sm:flex gap-4'
				justify='center'>
				<NavbarItem isActive>
					<Link
						aria-current='page'
						href='#'>
						Account
					</Link>
				</NavbarItem>
			</NavbarContent>
			<NavbarContent justify='end'>
				{session ? (
					<NavbarItem>
						<LogoutButton />
					</NavbarItem>
				) : (
					<NavbarItem className='hidden lg:flex'>
						<Link href='/login'>Login</Link>
					</NavbarItem>
				)}
				<NavbarMenuToggle className='sm:hidden' />
			</NavbarContent>
			<NavbarMenu>
				{menuItems.map((item, index) => (
					<NavbarMenuItem key={`${item}-${index}`}>
						<Link
							className='w-full'
							color={index === 2 ? 'primary' : index === menuItems.length - 1 ? 'danger' : 'foreground'}
							href='#'
							size='lg'>
							{item}
						</Link>
					</NavbarMenuItem>
				))}
			</NavbarMenu>
		</Navbar>
	);
}
