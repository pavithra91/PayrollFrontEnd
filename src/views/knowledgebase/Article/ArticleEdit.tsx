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

type FormModel = {
    title: string
    content: string
    category: string
}

const demoText =
    '<p>&lt;img src="/img/logo/logo-light-full.png" alt="CPSTL Payroll System logo"&gt;</p>'

const Article = ({ mode }: { mode: string }) => {
    const navigate = useNavigate()

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
                content: demoText.replace('&lt;','<'),
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
                                <Button type='submit' loading={isSubmitting} variant="solid">
                                    Submit
                                </Button>
                            </div>
                        </FormContainer>
                </Form>
            )}
        </Formik>
    )
}

export default Article
