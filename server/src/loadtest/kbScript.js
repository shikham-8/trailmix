//see this link for k6 information: https://k6.io/docs/getting-started/running-k6
//make sure server is running before running this load test
//k6 will output information about its test, and data can also be visualized
//through honeycomb (see "Initial k6 test" for preliminary test)

//to install k6 on Mac, use "brew install k6" in terminal
//to run this script, use the command: k6 run server/src/loadtest/kbScript.js

import http from 'k6/http'
import { sleep } from 'k6'
import { Counter, Rate } from 'k6/metrics'

export const options = {
  scenarios: {
    example_scenario: {
      // name of the executor to use
      executor: 'ramping-arrival-rate',
      // common scenario configuration
      startRate: '50',
      timeUnit: '1s',
      // executor-specific configuration
      preAllocatedVUs: 50,
      maxVUs: 100,
      stages: [
        { target: 200, duration: '30s' },
        { target: 0, duration: '30s' },
      ],
    },
  },
}

export default function () {
  //recordRates('http://localhost:3000')
  // recordRates(
  const getApp = http.get('https://trailmix.cloudcity.computer/app/index')
  const resp = http.post(
    'https://trailmix.cloudcity.computer/graphql',
    '{"operationName":"FetchLatLon","variables":{"zipcode":90024},"query":"query FetchLatLon($zipcode: Int!) {\n  coordinates(zipcode: $zipcode) {\n    lat\n    lon\n    __typename\n  }\n}\n"}',
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
  const hikes = http.post(
    'https://trailmix.cloudcity.computer/graphql',
    '{"operationName":"FetchHikes","variables":{"zipcode":90024},"query":"query FetchHikes {↵  hikes {↵    id↵    name↵    summary↵    length↵    difficulty↵    location↵    stars↵    latitude↵    longitude↵    __typename↵  }↵}↵"}',
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
  const comments = http.post(
    'https://trailmix.cloudcity.computer/graphql',
    '{"operationName":"AddComment","input: {id: 7002910, name: "test", text: "test 1", date: "9:48:27 PM, 12/3/2020"},"query":"mutation AddComment($input: AddCommentInput!) {↵  addComment(input: $input)↵}↵"}',
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
  const comments2 = http.post(
    'https://trailmix.cloudcity.computer/graphql',
    '{"operationName":"AddComment","input: {id: 7002910, name: "test", text: "test 2", date: "9:49:27 PM, 12/3/2020"},"query":"mutation AddComment($input: AddCommentInput!) {↵  addComment(input: $input)↵}↵"}',
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
  const fetchAllComments = http.post(
    'https://trailmix.cloudcity.computer/graphql',
    '{"operationName":"FetchComments","variables": "{}","query":"query FetchComments {↵  comments {↵    id↵    name↵    text↵    date↵    hikeNum↵    likes↵    __typename↵  }↵}↵"}'
  )
  // )
  // sleep(Math.random() * 3)
}

const count200 = new Counter('status_code_2xx')
const count300 = new Counter('status_code_3xx')
const count400 = new Counter('status_code_4xx')
const count500 = new Counter('status_code_5xx')

const rate200 = new Rate('rate_status_code_2xx')
const rate300 = new Rate('rate_status_code_3xx')
const rate400 = new Rate('rate_status_code_4xx')
const rate500 = new Rate('rate_status_code_5xx')

function recordRates(res) {
  if (res.status >= 200 && res.status < 300) {
    count200.add(1)
    rate200.add(1)
  } else if (res.status >= 300 && res.status < 400) {
    console.log(res.body)
    count300.add(1)
    rate300.add(1)
  } else if (res.status >= 400 && res.status < 500) {
    count400.add(1)
    rate400.add(1)
  } else if (res.status >= 500 && res.status < 600) {
    count500.add(1)
    rate500.add(1)
  }
}
