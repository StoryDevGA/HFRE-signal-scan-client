import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import Alert from '../components/Alert.jsx'
import Button from '../components/Button.jsx'
import FormField from '../components/FormField.jsx'
import { api } from '../lib/api.js'

const urlPattern = /^https?:\/\/.+/i

function Home() {
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onBlur',
  })

  const onSubmit = async (values) => {
    setSubmitError('')
    try {
      const result = await api.post('/api/public/scans', values)
      if (!result?.publicId) {
        throw new Error('Missing publicId in response.')
      }
      navigate(`/results/${result.publicId}`)
    } catch (error) {
      setSubmitError(error.message || 'Unable to submit the scan right now.')
    }
  }

  return (
    <main className="page container">
      <header className="page__header">
        <h1 className="text-responsive-xl">HFRE Signal Scan</h1>
        <p className="text-responsive-base">
          Share your details and receive a customer-safe scan report.
        </p>
      </header>

      {submitError ? (
        <Alert variant="error" title="Submission failed">
          {submitError}
        </Alert>
      ) : null}

      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          id="name"
          label="Contact name"
          error={errors.name?.message}
        >
          <input
            id="name"
            className="input"
            type="text"
            placeholder="Jane Doe"
            aria-invalid={Boolean(errors.name)}
            {...register('name', { required: 'Name is required.' })}
          />
        </FormField>

        <FormField
          id="email"
          label="Email"
          error={errors.email?.message}
        >
          <input
            id="email"
            className="input"
            type="email"
            placeholder="jane@company.com"
            aria-invalid={Boolean(errors.email)}
            {...register('email', {
              required: 'Email is required.',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email address.',
              },
            })}
          />
        </FormField>

        <FormField
          id="company_name"
          label="Company name"
          error={errors.company_name?.message}
        >
          <input
            id="company_name"
            className="input"
            type="text"
            placeholder="Company Inc."
            aria-invalid={Boolean(errors.company_name)}
            {...register('company_name', {
              required: 'Company name is required.',
            })}
          />
        </FormField>

        <FormField
          id="homepage_url"
          label="Website"
          error={errors.homepage_url?.message}
        >
          <input
            id="homepage_url"
            className="input"
            type="url"
            placeholder="https://company.com"
            aria-invalid={Boolean(errors.homepage_url)}
            {...register('homepage_url', {
              required: 'Website URL is required.',
              pattern: {
                value: urlPattern,
                message: 'Enter a full URL starting with http or https.',
              },
            })}
          />
        </FormField>

        <FormField
          id="product_name"
          label="Product or solution"
          error={errors.product_name?.message}
        >
          <input
            id="product_name"
            className="input"
            type="text"
            placeholder="Flagship product"
            aria-invalid={Boolean(errors.product_name)}
            {...register('product_name', {
              required: 'Product or solution is required.',
            })}
          />
        </FormField>

        <FormField
          id="product_page_url"
          label="Product or solution page"
          error={errors.product_page_url?.message}
        >
          <input
            id="product_page_url"
            className="input"
            type="url"
            placeholder="https://company.com/product"
            aria-invalid={Boolean(errors.product_page_url)}
            {...register('product_page_url', {
              required: 'Product page URL is required.',
              pattern: {
                value: urlPattern,
                message: 'Enter a full URL starting with http or https.',
              },
            })}
          />
        </FormField>

        <Button type="submit" loading={isSubmitting} fullWidth>
          {isSubmitting ? 'Submitting...' : 'Generate report'}
        </Button>
      </form>
    </main>
  )
}

export default Home
