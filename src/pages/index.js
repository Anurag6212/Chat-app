import Head from "next/head";
import { Inter } from "@next/font/google";
import styles from "../styles/join.module.css";
import { useRouter } from "next/router";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  return (
    <>
      <Head>
        <title>Chat App</title>
        <meta name="description" content="This is chat app." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <div className={styles["login-box"]}>
        <h1 className={styles["title"]}>Login</h1>
        <form className={styles["login-form"]}>
          <label htmlFor="name" className={styles["label"]}>
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles["input"]}
            placeholder="Enter your name"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              if (name) {
                router.push(
                  {
                    pathname: "/chat",
                    query: {
                      name,
                    },
                  },
                  "/chat"
                );
              }
            }}
            type="submit"
            className={styles["button"]}
          >
            Join
          </button>
        </form>
      </div>
    </>
  );
}
