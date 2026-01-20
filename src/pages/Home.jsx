import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button/Button.jsx'
import Fieldset from '../components/Fieldset/Fieldset.jsx'
import Header from '../components/Header/Header.jsx'
import Input from '../components/Input/Input.jsx'
import Link from '../components/Link/Link.jsx'
import Radio from '../components/Radio/Radio.jsx'
import Footer from '../components/Footer/Footer.jsx'
import { useToaster } from '../components/Toaster/Toaster.jsx'
import { submitPublicScan } from '../services/publicScans.js'
import { getValidationRules, sanitizeInput } from '../utils/formValidation.js'
import storylineLogo from '../assets/images/storylineOS-Logo.png'
import storylineIcon from '../assets/icons/storylineOS-icon.png'

const urlPattern = /^https?:\/\/.+/i

function Home() {
  const navigate = useNavigate()
  const { addToast } = useToaster()
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      product_name: 'Product',
    },
  })

  const [name, email, companyName, homepageUrl, productName, productPageUrl] =
    watch([
      'name',
      'email',
      'company_name',
      'homepage_url',
      'product_name',
      'product_page_url',
    ])

  const isComplete = [
    name,
    email,
    companyName,
    homepageUrl,
    productPageUrl,
  ].every((value) => String(value || '').trim().length > 0)

  const onSubmit = async (values) => {
    try {
      // Sanitize all inputs before sending to backend
      const sanitizedValues = {
        name: sanitizeInput(values.name),
        email: sanitizeInput(values.email),
        company_name: sanitizeInput(values.company_name),
        homepage_url: sanitizeInput(values.homepage_url),
        product_name: values.product_name, // Radio button - use as-is (fixed values only)
        product_page_url: sanitizeInput(values.product_page_url),
      }

      const result = await submitPublicScan(sanitizedValues)
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
    <>
      <Header
        logo={<img src={storylineLogo} alt="StorylineOS" className="home__brand-logo" />}
        logoLink="/"
        showNavigation={false}
      />
      <main className="page container">
        <header className="page__header">
          <Link href="https://www.storylineos.com/" openInNewTab className="home__back-link">
            Back to StorylineOS
          </Link>
          <h1 className="text-responsive-xl text-uppercase"> signal scan</h1>
          <p className="text-responsive-base">
            Share your details and receive a customer-safe scan report.
          </p>
          <div className="home__benefits">
            <div>Instant results</div>
            <div>Confidential</div>
            <div>Free</div>
          </div>
          <p className="text-responsive-sm text-tertiary">
            We only scan public information and never share your data.
          </p>
        </header>

        <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Fieldset>
            <Fieldset.Legend>
              <span className="home__legend">
                <span>Scan details</span>
              </span>
            </Fieldset.Legend>
            <Fieldset.Content>
              <Input
                id="name"
                label="Contact name"
                error={errors.name?.message}
                required
                fullWidth
                maxLength="100"
                {...register('name', getValidationRules('name'))}
              />

              <Input
                id="email"
                type="email"
                label="Email"
                error={errors.email?.message}
                required
                fullWidth
                maxLength="254"
                {...register('email', getValidationRules('email'))}
              />

              <Input
                id="company_name"
                label="Company name"
                error={errors.company_name?.message}
                required
                fullWidth
                maxLength="200"
                {...register('company_name', getValidationRules('company_name'))}
              />

              <Input
                id="homepage_url"
                type="url"
                label="Website"
                error={errors.homepage_url?.message}
                helperText="https://example.com"
                required
                fullWidth
                maxLength="2048"
                placeholder="https://example.com"
                {...register('homepage_url', getValidationRules('homepage_url'))}
              />

              <fieldset className="radio-group" aria-required="true">
                <legend className="radio-group__label">
                  Product or solution
                  <span className="input-label__required"> *</span>
                </legend>
                <Controller
                  name="product_name"
                  control={control}
                  rules={{
                    required: 'Please select Product or Solution.',
                    validate: (value) => {
                      if (!['Product', 'Solution'].includes(value)) {
                        return 'Invalid selection.';
                      }
                      return true;
                    },
                  }}
                  render={({ field }) => (
                    <div className="radio-group__options">
                      <Radio
                        id="product_type_product"
                        name={field.name}
                        value="Product"
                        label="Product"
                        checked={field.value === 'Product'}
                        onChange={() => field.onChange('Product')}
                        onBlur={field.onBlur}
                        aria-describedby={errors.product_name ? 'product_name-error' : undefined}
                        aria-invalid={errors.product_name ? 'true' : 'false'}
                        aria-required="true"
                        required
                      />
                      <Radio
                        id="product_type_solution"
                        name={field.name}
                        value="Solution"
                        label="Solution"
                        checked={field.value === 'Solution'}
                        onChange={() => field.onChange('Solution')}
                        onBlur={field.onBlur}
                        aria-describedby={errors.product_name ? 'product_name-error' : undefined}
                        aria-invalid={errors.product_name ? 'true' : 'false'}
                        aria-required="true"
                        required
                      />
                    </div>
                  )}
                />
                {errors.product_name?.message ? (
                  <span className="input-error" id="product_name-error" role="alert">
                    {errors.product_name?.message}
                  </span>
                ) : null}
              </fieldset>

              <Input
                id="product_page_url"
                type="url"
                label="Product or solution page"
                error={errors.product_page_url?.message}
                helperText="https://example.com/product"
                required
                fullWidth
                maxLength="2048"
                placeholder="https://example.com/product"
                {...register('product_page_url', getValidationRules('product_page_url'))}
              />
              <Button
                type="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
                fullWidth
              >
                {isSubmitting ? 'Submitting...' : 'Generate My Report'}
              </Button>
              {!isComplete ? (
                <span className="text-responsive-sm text-tertiary">
                  Complete all fields to proceed.
                </span>
              ) : null}
            </Fieldset.Content>
          </Fieldset>
        </form>
      </main>
      <Footer copyright="StorylineOS" />
    </>
  )
}

export default Home
