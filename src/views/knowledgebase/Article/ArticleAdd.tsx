import { useState, useEffect } from 'react'
import Input from '@/components/ui/Input'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import RichTextEditor from '@/components/shared/RichTextEditor'
import { Field, Form, Formik } from 'formik'
import { useNavigate } from 'react-router-dom'
import ReactHtmlParser from 'html-react-parser'
import * as Yup from 'yup'
import type { FieldProps } from 'formik'
import useKnowledgeBase from '@/utils/hooks/useKnowledgeBase'

type FormModel = {
    title: string
    content: string
    category: string
}

const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title required'),
    category: Yup.string().required('Category required'),
    content: Yup.string().required('Content required'),
})

const demoText =
    '<p>&lt;img src="/img/logo/logo-light-full.png" alt="CPSTL Payroll System logo"&gt;</p>'

const CreateArticle = ({ mode }: { mode: string }) => {
    const navigate = useNavigate()

    const { addArticle } = useKnowledgeBase()

    const [categoryList, setCategoryList] = useState([
        { label: 'Survey', value: 'survey' },
        { label: 'Themes', value: 'themes' },
        { label: 'Security', value: 'security' },
        { label: 'Integration', value: 'integration' },
        { label: 'Media', value: 'media' },
        { label: 'Analytic', value: 'analytic' },
        { label: 'Chatbot', value: 'chatbot' },
        { label: 'Commission', value: 'commission' },
    ])

    const onComplete = async (
        value: FormModel,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        setSubmitting(true)

        console.log(value)
        // const newData = { ...article, ...value, categoryLabel }
        const resp = await addArticle(value)
        console.log(resp)
        setSubmitting(false)
        // if (resp.data) {
        //     toast.push(
        //         <Notification
        //             title={`Successfully ${mode} article`}
        //             type="success"
        //         />,
        //         {
        //             placement: 'top-center',
        //         }
        //     )
        //     //navigate('/app/knowledge-base/manage-articles')
        // }

        setSubmitting(false)
    }

    return (
        <>
            <Formik
                enableReinitialize
                initialValues={{
                    title: '',
                    content: '',
                    category: '',
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    onComplete(values, setSubmitting)
                }}
            >
                {({ values, touched, errors, isSubmitting }) => (
                    <Form>
                        {mode === 'preview' ? (
                            <div className="mt-6">
                                <h4 className="mb-4">{values.title}</h4>
                                <div className="prose dark:prose-invert max-w-none">
                                    {ReactHtmlParser(values.content || '')}
                                </div>
                            </div>
                        ) : (
                            <FormContainer>
                                <FormItem
                                    label="Title"
                                    invalid={errors.title && touched.title}
                                    errorMessage={errors.title}
                                >
                                    <Field
                                        autoComplete="off"
                                        name="title"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    label="Category"
                                    invalid={
                                        errors.category && touched.category
                                    }
                                    errorMessage={errors.category}
                                >
                                    <Field name="category">
                                        {({ field, form }: FieldProps) => (
                                            <Select
                                                placeholder="Category"
                                                field={field}
                                                form={form}
                                                options={categoryList}
                                                value={categoryList.filter(
                                                    (category) =>
                                                        category.value ===
                                                        values.category
                                                )}
                                                onChange={(category) =>
                                                    form.setFieldValue(
                                                        field.name,
                                                        category?.value
                                                    )
                                                }
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                                <FormItem
                                    label="Content"
                                    className="mb-0"
                                    labelClass="!justify-start"
                                    invalid={errors.content && touched.content}
                                    errorMessage={errors.content}
                                >
                                    <Field name="content">
                                        {({ field, form }: FieldProps) => (
                                            <RichTextEditor
                                                value={field.value}
                                                onChange={(val) =>
                                                    form.setFieldValue(
                                                        field.name,
                                                        val
                                                    )
                                                }
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                                <div className="mt-4 flex justify-end">
                                    <Button
                                        loading={isSubmitting}
                                        variant="solid"
                                    >
                                        Submit
                                    </Button>
                                </div>
                            </FormContainer>
                        )}
                    </Form>
                )}
            </Formik>
        </>
        // <Formik
        //     enableReinitialize
        //     initialValues={{
        //         content: demoText.replace('&lt;', '<'),
        //     }}
        //     //  validationSchema={validationSchema}
        //     onSubmit={(values, { setSubmitting }) => {
        //         console.log(values)
        //         //onComplete(values, setSubmitting)
        //     }}
        // >
        //     {({ values, touched, errors, isSubmitting }) => (
        //         <Form>
        //             <FormContainer>
        //                 <FormItem
        //                     label="Content"
        //                     className="mb-0"
        //                     labelClass="!justify-start"
        //                     //    invalid={errors.content && touched.content}
        //                     //    errorMessage={errors.content}
        //                 >
        //                     <Field name="content">
        //                         {({ field, form }: FieldProps) => (
        //                             <RichTextEditor
        //                                 value={field.value}
        //                                 onChange={(val) =>
        //                                     form.setFieldValue(field.name, val)
        //                                 }
        //                             />
        //                         )}
        //                     </Field>
        //                 </FormItem>
        //                 <div className="mt-4 flex justify-end">
        //                     <Button
        //                         type="submit"
        //                         loading={isSubmitting}
        //                         variant="solid"
        //                     >
        //                         Submit
        //                     </Button>
        //                 </div>
        //             </FormContainer>
        //         </Form>
        //     )}
        // </Formik>
    )
}

export default CreateArticle
