import "@/app/globals.css";

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	// This function returns the children elements passed to it
	// It is used as the root layout for the application
	return children;
	

}
