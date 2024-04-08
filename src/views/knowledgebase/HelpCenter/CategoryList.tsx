import { CategoryData } from '@/@types/KnowledgeBase'
import { Card } from '@/components/ui/Card'
import { Tag } from '@/components/ui/Tag'
import useKnowledgeBase from '@/utils/hooks/useKnowledgeBase'
import { useEffect, useState } from 'react'
import { HiOutlineClock, HiStar } from 'react-icons/hi'
import { createSearchParams, useNavigate } from 'react-router-dom'
import ReactHtmlParser from 'html-react-parser'
import ArticleContent from '../Article/ArticleContent'

export type Article = {
    id: string
    title: string
    content: string
    category: string
    authors: {
        name: string
        img: string
    }[]
    starred: boolean
    updateTime: string
    createdBy: string
    timeToRead: number
    viewCount: number
}

const articleTagClass = (category: string) => {
    switch (category) {
        case 'User Account':
            return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100'
        case 'Calculations':
            return 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-100 dark:bg-blue-500/20 dark:text-blue-100'
        case 'Payroll':
            return 'text-purple-500 bg-purple-100 dark:bg-purple-500/20 dark:text-purple-100'
        case 'integration':
            return 'text-pink-500 bg-pink-100 dark:bg-pink-500/20 dark:text-pink-100'
        case 'media':
            return 'text-cyan-500 bg-cyan-100 dark:bg-cyan-500/20 dark:text-cyan-100'
        case 'analytic':
            return 'text-orange-500 bg-orange-100 dark:bg-orange-500/20 dark:text-orange-100'
        case 'chatbot':
            return 'text-indigo-500 bg-indigo-100 dark:bg-indigo-500/20 dark:text-indigo-100'
        case 'commission':
            return 'text-teal-500 bg-teal-100 dark:bg-teal-500/20 dark:text-teal-100'
        default:
            return ''
    }
}

const ListView = ({ categoryId }: { categoryId?: number }) => {
    const navigate = useNavigate()

    const { getArticleByCategory } = useKnowledgeBase()
    const [data, setData] = useState<Article[]>([])
    const [ArticleId, setArticleId] = useState<Article>()
    const [isArticleIdClicked, setIsArticleIdClicked] = useState(false)

    const onArticleClick = (id: number) => {
        let article = data.find((item) => item.id == id.toString())

        setArticleId(article)
        setIsArticleIdClicked(true)
    }

    const values: CategoryData = {
        id: categoryId,
    }

    useEffect(() => {
        console.log(isArticleIdClicked)
    }, [isArticleIdClicked])

    useEffect(() => {
        const articles = getArticleByCategory(values)
        articles.then((res) => {
            const listItems = JSON.parse(res?.data?.data ?? '')

            setData(listItems)

            // if (listItems.length > 0) {
            //     setData(listItems[0])

            // } else {
            //     openNotification('danger', 'No Data Available')
            // }
        })
    }, [])

    const handleChildData = (data: any) => {
        setIsArticleIdClicked(data)
    }

    return (
        <>
            {isArticleIdClicked && (
                <ArticleContent
                    article={ArticleId}
                    articleList={data}
                    onSendData={handleChildData}
                />
            )}

            {!isArticleIdClicked &&
                data.map((article) => (
                    <article key={article.id}>
                        <Card
                            clickable
                            className="group mb-4"
                            onClick={() => onArticleClick(parseInt(article.id))}
                        >
                            <div className="px-8 py-3 relative">
                                {article.starred && (
                                    <div className="absolute ltr:left-0 rtl:right-0">
                                        <div className="text-amber-500 p-0.5 rounded-full border border-amber-500 mt-1">
                                            <HiStar />
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center justify-between mb-2">
                                    <h5 className="group-hover:underline">
                                        {article.title}
                                    </h5>
                                    <Tag
                                        className={`border-0 rounded capitalize ${articleTagClass(
                                            article.category
                                        )}`}
                                    >
                                        {article.category}
                                    </Tag>
                                </div>
                                <p>
                                    {article.content.length > 230
                                        ? ReactHtmlParser(article.content || '')
                                              .toString()
                                              .substring(0, 229) + '...'
                                        : ReactHtmlParser(article.content)}
                                </p>
                                <div className="flex items-center justify-between mt-6">
                                    <div className="flex items-center gap-2">
                                        <span>Written by:</span>
                                        {article.createdBy}
                                        {/* <UsersAvatarGroup
                                        avatarProps={{ size: 25 }}
                                        users={article.authors || []}
                                    /> */}
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-2">
                                            <HiOutlineClock className="text-lg" />
                                            <span>
                                                Updated
                                                {/* {article.updateTime} */}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </article>
                ))}
        </>
    )
}

export default ListView
