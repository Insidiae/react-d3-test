import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Sample Charts
        </h1>

        <p className={styles.description}>
          Powered by <a href="https://d3js.org/">D3</a> and <a href="https://nextjs.org">Next.js!</a>
        </p>

        <div className={styles.grid}>
          <Link href="/charts/freq-analyzer">
            <a className={styles.card}>
              <h3>Frequency Analyzer &rarr;</h3>
              <p>Counts the number of letters on an input.</p>
            </a>
          </Link>

          <Link href="/charts/histogram">
            <a className={styles.card}>
              <h3>Histogram &rarr;</h3>
              <p>View a histogram that lets you set a variable bin count.</p>
            </a>
          </Link>

          <Link href="/charts/pie">
            <a className={styles.card}>
              <h3>Pie Chart &rarr;</h3>
              <p>View a pie chart representing the number of births by month/quarter from 1967 to 2014.</p>
            </a>
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
};
