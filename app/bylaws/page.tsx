import fs from 'fs/promises'
import path from 'path'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

export default async function Page() {
	const filePath = path.join(process.cwd(), 'app', 'bylaws', 'bylaws.md')
	let content = ''
	try {
		content = await fs.readFile(filePath, 'utf8')
	} catch (err) {
		content = '規約ファイルが見つかりません。'
	}

	return (
		<main className="max-w-3xl mx-auto p-8">
			{/* Page-scoped wrapper so styles can target only bylaws page */}
			<div className="bylaws-page">
				<article className="prose dark:prose-invert">
					<ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
						{content}
					</ReactMarkdown>
				</article>
			</div>
		</main>
	)
}
