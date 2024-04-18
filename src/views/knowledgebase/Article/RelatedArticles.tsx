import AdaptableCard from '@/components/shared/AdaptableCard'
import Loading from '@/components/shared/Loading'
import TextEllipsis from '@/components/shared/TextEllipsis'
import MediaSkeleton from '@/components/shared/loaders/MediaSkeleton'
import TextBlockSkeleton from '@/components/shared/loaders/TextBlockSkeleton'
import { Button } from '@/components/ui/Button'
import classNames from 'classnames'
import ReactHtmlParser from 'html-react-parser'
import { NavLink, useNavigate } from 'react-router-dom'

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

type ArticleItemProps = {
    data?: Partial<Article>
    isLastChild?: boolean
}

const RelatedArticles = ({
    article,
    onSendData,
}: {
    article: Article[]
    onSendData: any
}) => {
    const ArticleItem = ({ data = {}, isLastChild }: ArticleItemProps) => {
        const navigate = useNavigate()

        const onArticleClick = (id: string) => {
            let articles = article.find((item) => item.id == id.toString())
            onSendData(articles)
        }

        // const onArticleClick = (id: number) => {
        //     let article = data.find((item) => item.id == id.toString())

        //     setArticleId(article)
        //     setIsArticleIdClicked(true)
        // }

        return (
            <div
                className={classNames(
                    'py-6 group cursor-pointer',
                    !isLastChild &&
                        'border-b border-gray-200 dark:border-gray-600'
                )}
                onClick={() => onArticleClick(data.id ?? '')}
            >
                <h6 className="mb-1 group-hover:underline !text-sm">
                    {data.title}
                </h6>
                <p className="mb-1">
                    <TextEllipsis
                        text={ReactHtmlParser(
                            data.content?.substring(0, 40) || ''
                        )}
                        maxTextCount={40}
                    />
                </p>
                <span className="text-xs">Updated {data.updateTime}</span>
            </div>
        )
    }

    return (
        <>
            <div className="lg:w-[400px] mt-6 ltr:lg:border-l rtl:lg:border-r border-gray-200 dark:border-gray-600 md:px-8">
                <div className="mb-8">
                    <h4>Related Topics</h4>
                    <Loading>
                        {article?.map((article, index) => (
                            <ArticleItem key={article.id} data={article} />
                        ))}
                    </Loading>
                </div>
            </div>
        </>
    )
}

export default RelatedArticles
