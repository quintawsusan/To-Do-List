"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css"; 

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const storedUid = localStorage.getItem("userId");
    if (storedUid && storedUid !== "undefined" && storedUid !== "null") {
      router.replace("/dashboard");
    }
  }, [router]);

  return (
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome to <br /> My To Do List 📝</h1>

        <p className={styles.subtitle}>
          To organize your tasks efficiently,
          please log in or create an account.
        </p>
        
        <div className={styles.buttons}>
          <Link href="/login" className={styles.buttonLogin}>
            Log In to My Account
          </Link>

          <Link href="/register" className={styles.buttonCreate}>
            Create an Account
          </Link>
        </div>
      </div>
  );
}
