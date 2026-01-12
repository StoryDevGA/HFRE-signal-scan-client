import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import Alert from '../components/Alert.jsx'
import Button from '../components/Button.jsx'
import Input from '../components/Input/Input.jsx'
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
        <Input
          id="name"
          label="Contact name"
          placeholder="Jane Doe"
          error={errors.name?.message}
          required
          fullWidth
          {...register('name', { required: 'Name is required.' })}
        />

        <Input
          id="email"
          type="email"
          label="Email"
          placeholder="jane@company.com"
          error={errors.email?.message}
          required
          fullWidth
          {...register('email', {
            required: 'Email is required.',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Enter a valid email address.',
            },
          })}
        />

        <Input
          id="company_name"
          label="Company name"
          placeholder="Company Inc."
          error={errors.company_name?.message}
          required
          fullWidth
          {...register('company_name', {
            required: 'Company name is required.',
          })}
        />

        <Input
          id="homepage_url"
          type="url"
          label="Website"
          placeholder="https://company.com"
          error={errors.homepage_url?.message}
          required
          fullWidth
          {...register('homepage_url', {
            required: 'Website URL is required.',
            pattern: {
              value: urlPattern,
              message: 'Enter a full URL starting with http or https.',
            },
          })}
        />

        <Input
          id="product_name"
          label="Product or solution"
          placeholder="Flagship product"
          error={errors.product_name?.message}
          required
          fullWidth
          {...register('product_name', {
            required: 'Product or solution is required.',
          })}
        />

        <Input
          id="product_page_url"
          type="url"
          label="Product or solution page"
          placeholder="https://company.com/product"
          error={errors.product_page_url?.message}
          required
          fullWidth
          {...register('product_page_url', {
            required: 'Product page URL is required.',
            pattern: {
              value: urlPattern,
              message: 'Enter a full URL starting with http or https.',
            },
          })}
        />

        <Button type="submit" loading={isSubmitting} fullWidth>
          {isSubmitting ? 'Submitting...' : 'Generate report'}
        </Button>
      </form>
    </main>
  )
}

export default Home
