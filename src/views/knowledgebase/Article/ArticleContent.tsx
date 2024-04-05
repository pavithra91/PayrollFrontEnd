import Loading from '@/components/shared/Loading'
import MediaSkeleton from '@/components/shared/loaders/MediaSkeleton'
import TextBlockSkeleton from '@/components/shared/loaders/TextBlockSkeleton'
import ReactHtmlParser from 'html-react-parser'

const ArticleContent = ({ articleId }: { articleId?: string }) => {
    
return (
    <>
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
            {/* <h3>{article.title}</h3>
            <div className="flex items-center mt-4 gap-4">
                <div className="text-xs">
                    <div className="mb-1">
                        Created by:
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                            {article.createdBy}
                        </span>
                    </div>
                    <div>
                        <span>Last updated: {article.updateTime}</span>
                    </div>
                </div>
            </div>
            <div className="mt-8 prose dark:prose-invert max-w-none">
                <p>{ReactHtmlParser(article.content || '')}</p>
            </div> */}
        </Loading>
        </>
)
}

export default ArticleContent