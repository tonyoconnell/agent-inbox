import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { Chat } from "@/components/Chat";
import { SidebarApp } from "@/components/ChatSidebar";

export default function Page() {
	return (
		<SidebarProvider>
			<SidebarApp />
			<SidebarInset className="flex flex-col h-screen overflow-y-auto">
				<header className="sticky top-0 flex h-11 shrink-0 items-center gap-2 bg-background">
					<div className="flex flex-1 items-center gap-2 px-3">
						<SidebarTrigger />
						<Separator orientation="vertical" className="mr-2 h-4" />
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem>
									<BreadcrumbPage className="line-clamp-1">
										Introducing Agent ONE
									</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</div>
				</header>
				<Chat />
			</SidebarInset>
		</SidebarProvider>
	);
}
