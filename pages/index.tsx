import Head from "next/head";

import SideMenu from "@/components/Menu/SidebarMenu/SidebarMenu";

export default function Home() {
  return (
    <>
      <Head>
        <title>Hunters Expense Tracker</title>
        <meta name="description" content="Hunter's Profit-Loss Expensidor" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SideMenu />
    </>
  );
}
