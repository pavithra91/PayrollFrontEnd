import type { CommonProps } from '@/@types/common'
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'
import { Card } from '@/components/ui/Card'
import useKnowledgeBase from '@/utils/hooks/useKnowledgeBase'
import { useEffect, useMemo, useState } from 'react'
import ListView from './CategoryList'
import { number } from 'yup'
import CategoryList from './CategoryList'

type cat = {
    id: number
    name: string
    articleCounts: number
}

const demoData =
    '[{"id": 0, "name": "Accounts", "articleCounts": 5}, {"id": 1, "name": "Payroll", "articleCounts": 2}]'

const Categories = () => {
    const { getCategoriesData } = useKnowledgeBase()
    const [data, setData] = useState([])
    const [categoryId, setListView] = useState(0)
    const [isCategorySelected, setIsCategorySelected] = useState(false)
    const [isArticleIdClicked, setIsArticleIdClicked] = useState(false)

    useEffect(() => {
        //setData(JSON.parse(demoData))
        const categories = getCategoriesData()
        categories.then((res) => {
            const listItems = JSON.parse(res?.data?.data ?? '')

            setData(listItems)
            console.log(listItems)
            // if (listItems.length > 0) {
            //     setData(listItems[0])

            // } else {
            //     openNotification('danger', 'No Data Available')
            // }
        })
    }, [])

    const onCategoryClick = (id: number) => {
        setListView(id)
        setIsCategorySelected(true)
    }

    const handleChildData = (data: any) => {
        setIsCategorySelected(data)
    }

    const CategoryIcon = ({ type }: { type: string }) => {
        const iconTypeProps = useMemo(() => {
            return {
                src: `/img/thumbs/help-center-category-${type}.png`,
                darkModeSrc: `/img/thumbs/help-center-category-${type}-dark.png`,
            }
        }, [type])

        return <DoubleSidedImage {...iconTypeProps} alt="" />
    }

    return (
        <>
            {!isCategorySelected && (
                <div className="grid lg:grid-cols-2 2xl:grid-cols-4 gap-4">
                    {data.map(
                        (cat: {
                            id: number
                            categoryName: string
                            articleCount: number
                        }) => (
                            <Card
                                key={cat.id}
                                clickable
                                onClick={() => onCategoryClick(cat.id)}
                            >
                                <div className="mb-4 flex justify-center">
                                    <CategoryIcon type={cat.id.toString()} />
                                </div>
                                <div className="text-center">
                                    <h5 className="mb-1">{cat.categoryName}</h5>
                                    <strong>{cat.articleCount} </strong>
                                    <span>Articles</span>
                                </div>
                            </Card>
                        )
                    )}
                </div>
            )}

            {isCategorySelected && (
                <CategoryList
                    categoryId={categoryId}
                    onSendData={handleChildData}
                />
            )}
        </>
    )
}

export default Categories
