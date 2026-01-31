import PropTypes from 'prop-types'
import Button from '../../../../components/Button/Button.jsx'
import Card from '../../../../components/Card/Card.jsx'
import Fieldset from '../../../../components/Fieldset/Fieldset.jsx'
import Input from '../../../../components/Input/Input.jsx'

const SubmissionLookupSection = ({
  detailId,
  setDetailId,
  loadDetail,
  detail,
}) => (
  <Fieldset>
    <Fieldset.Legend>Submission analytics</Fieldset.Legend>
    <Fieldset.Content>
      <Card
        className="detail-card"
        variant="filled"
        backgroundColor="transparent"
        bordered={false}
      >
        <form className="form" onSubmit={(event) => event.preventDefault()}>
          <Fieldset>
            <Fieldset.Legend>Lookup</Fieldset.Legend>
            <Fieldset.Content>
              <Input
                id="analytics_submission_id"
                label="Submission ID"
                value={detailId}
                onChange={(event) => setDetailId(event.target.value)}
                fullWidth
              />
              <Button variant="secondary" onClick={loadDetail} type="button" size="xs">
                Fetch detail
              </Button>
            </Fieldset.Content>
          </Fieldset>
        </form>

        {detail ? (
          <dl className="detail-list">
            <div>
              <dt>Submission</dt>
              <dd>{detail.submissionId || detail.submission || '-'}</dd>
            </div>
            <div>
              <dt>IP address</dt>
              <dd>{detail.ipAddress || '-'}</dd>
            </div>
            <div>
              <dt>User agent</dt>
              <dd>{detail.userAgent || '-'}</dd>
            </div>
            <div>
              <dt>Accept-Language</dt>
              <dd>{detail.acceptLanguage || '-'}</dd>
            </div>
            <div>
              <dt>Referrer</dt>
              <dd>{detail.referrer || '-'}</dd>
            </div>
            <div>
              <dt>Device summary</dt>
              <dd>{detail.deviceSummary || '-'}</dd>
            </div>
          </dl>
        ) : null}
      </Card>
    </Fieldset.Content>
  </Fieldset>
)

SubmissionLookupSection.propTypes = {
  detailId: PropTypes.string.isRequired,
  setDetailId: PropTypes.func.isRequired,
  loadDetail: PropTypes.func.isRequired,
  detail: PropTypes.shape({
    submissionId: PropTypes.string,
    submission: PropTypes.string,
    ipAddress: PropTypes.string,
    userAgent: PropTypes.string,
    acceptLanguage: PropTypes.string,
    referrer: PropTypes.string,
    deviceSummary: PropTypes.string,
  }),
}

export default SubmissionLookupSection
