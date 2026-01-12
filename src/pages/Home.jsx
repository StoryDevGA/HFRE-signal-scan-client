import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button/Button.jsx'
import Fieldset from '../components/Fieldset/Fieldset.jsx'
import Input from '../components/Input/Input.jsx'
import { useToaster } from '../components/Toaster/Toaster.jsx'
import { submitPublicScan } from '../services/publicScans.js'

const urlPattern = /^https?:\/\/.+/i

function Home() {
  const navigate = useNavigate()
  const { addToast } = useToaster()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onBlur',
  })

  const onSubmit = async (values) => {
    try {
      const result = await submitPublicScan(values)
      if (!result?.publicId) {
        throw new Error('Missing publicId in response.')
      }
      addToast({
        title: 'Report generated',
        description: 'Redirecting you to your scan results.',
        variant: 'success',
      })
      navigate(`/results/${result.publicId}`)
    } catch (error) {
      addToast({
        title: 'Submission failed',
        description: error.message || 'Unable to submit the scan right now.',
        variant: 'error',
      })
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

      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <Fieldset>
          <Fieldset.Legend>Scan details</Fieldset.Legend>
          <Fieldset.Content>
            <Input
              id="name"
              label="Contact name"
              error={errors.name?.message}
              required
              fullWidth
              {...register('name', { required: 'Name is required.' })}
            />

            <Input
              id="email"
              type="email"
              label="Email"
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
          </Fieldset.Content>
        </Fieldset>

        <Button type="submit" loading={isSubmitting} fullWidth>
          {isSubmitting ? 'Submitting...' : 'Generate report'}
        </Button>
      </form>
    </main>
  )
}

export default Home
