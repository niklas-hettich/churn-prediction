run this command if the backend is changed:

gcloud run deploy mindfuel-application-backend \
  --source . \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --memory 2Gi \
  --min-instances=1 \
  --project anny-bot-448008

