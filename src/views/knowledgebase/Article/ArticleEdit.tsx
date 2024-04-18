import { useState } from 'react'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import RichTextEditor from '@/components/shared/RichTextEditor'
import { Field, Form, Formik } from 'formik'
import type { FieldProps } from 'formik'
import Input from '@/components/ui/Input/Input'
import { title } from 'process'

type FormModel = {
    title: string
    content: string
    category: string
}

const ArticleEdit = ({ article }: { article: any }) => {
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
        setSubmitting(false)
    }

    return (
        <Formik
            enableReinitialize
            initialValues={{
                title: article.title,
                content: article.content,
            }}
            //  validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
                console.log(values)
                //onComplete(values, setSubmitting)
            }}
        >
            {({ values, touched, errors, isSubmitting }) => (
                <Form>
                    <FormContainer>
                        <FormItem
                            label="Title"
                            //invalid={errors.title && touched.title}
                            // errorMessage={errors.title}
                        >
                            <Field
                                autoComplete="off"
                                name="title"
                                component={Input}
                                value={article.title}
                            />
                        </FormItem>
                        <FormItem
                            label="Content"
                            className="mb-0"
                            labelClass="!justify-start"
                            //    invalid={errors.content && touched.content}
                            //    errorMessage={errors.content}
                        >
                            <Field name="content">
                                {({ field, form }: FieldProps) => (
                                    <RichTextEditor
                                        value={field.value}
                                        onChange={(val) =>
                                            form.setFieldValue(field.name, val)
                                        }
                                    />
                                )}
                            </Field>
                        </FormItem>
                        <div className="mt-4 flex justify-end">
                            <Button
                                type="submit"
                                loading={isSubmitting}
                                variant="solid"
                            >
                                Submit
                            </Button>
                        </div>
                    </FormContainer>
                </Form>
            )}
        </Formik>
    )
}

export default ArticleEdit
