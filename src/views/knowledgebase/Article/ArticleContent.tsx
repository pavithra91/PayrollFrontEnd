import AdaptableCard from '@/components/shared/AdaptableCard'
import Loading from '@/components/shared/Loading'
import MediaSkeleton from '@/components/shared/loaders/MediaSkeleton'
import TextBlockSkeleton from '@/components/shared/loaders/TextBlockSkeleton'
import { Button } from '@/components/ui/Button'
import ReactHtmlParser from 'html-react-parser'
import { NavLink, useNavigate } from 'react-router-dom'
import RelatedArticles from './RelatedArticles'
import { useState } from 'react'

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
    categoryId: number
}

const ArticleContent = ({
    article,
    articleList,
    onSendData,
}: {
    articleList: Article[]
    article: Article
    onSendData: any
}) => {

    const backClick = () => {
        onSendData(false)
    }

    const [articleid, setArticleId] = useState<Article>()

    const handleChildData = (data: any) => {
        setArticleId(data)
        article = data
        console.log(article)
    }
    return (
        <>
            <AdaptableCard bodyClass="lg:flex gap-4">
                <div className="my-6 w-full mx-auto">
                    <Loading
                        //loading={loading}
                        customLoader={
                            <div className="flex flex-col gap-8">
                                <MediaSkeleton />
                                <TextBlockSkeleton rowCount={6} />
                                <TextBlockSkeleton rowCount={4} />
                                <TextBlockSkeleton rowCount={8} />
                            </div>
                        }
                    >
                        <h3>{article.title}</h3>
                        <div className="flex items-center mt-4 gap-4">
                            <div className="text-xs">
                                <div className="mb-1">
                                    Created by:{' '}
                                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                                        {article.createdBy}
                                    </span>
                                </div>
                                <div>
                                    <span>
                                        Last updated: {article.updateTime}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 prose dark:prose-invert max-w-none">
                            <p>{ReactHtmlParser(article.content || '')}</p>
                        </div>
                    </Loading>

                    <div className="mt-12">
                        <div className="mt-3 flex justify-end">
                            <Button variant="solid" onClick={backClick}>
                                Back
                            </Button>
                        </div>
                    </div>
                </div>

                <RelatedArticles article={articleList} onSendData={handleChildData} />
            </AdaptableCard>
        </>
    )
}

export default ArticleContent
