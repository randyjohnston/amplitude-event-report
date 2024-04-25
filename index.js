import { gql, request } from 'graphql-request'

const endpoint = `https://app.amplitude.com/o/graphql?q=SimpleObservedEvents`

const document = gql`
    query SimpleObservedEvents(
        $orgId: ID!
        $workspaceId: ID!
        $branchId: ID!
        $versionId: ID!
        $dateStart: DateTime!
        $dateEnd: DateTime!
        $environmentId: ID
        $branchName: String!
    ) {
        orgs(id: $orgId) {
        id
        workspaces(id: $workspaceId) {
            id
            branches(id: $branchId) {
            id
            versions(
                id: $versionId
                dateStart: $dateStart
                dateEnd: $dateEnd
                environmentId: $environmentId
                branchName: $branchName
            ) {
                id
                events(statuses: [live, planned, blocked, unexpected]) {
                ...SimpleObservedEvent
                __typename
                }
                __typename
            }
            __typename
            }
            __typename
        }
        __typename
        }
    }
    fragment SimpleObservedEvent on ObservableEvent {
        ...ObservedEvent
        user {
        ...User
        __typename
        }
        eventReport {
        eventCount
        eventErrorAggregation
        volumeSeries {
            times
            eventCounts
            __typename
        }
        auditAggregations {
            ...EventAuditAggregation
            __typename
        }
        eventSourceReports {
            ...SimpleEventSourceReport
            __typename
        }
        anomalyCount
        __typename
        }
        seenStats {
        firstSeen
        lastSeen
        __typename
        }
        __typename
    }
    fragment ObservedEvent on ObservableEvent {
        id
        name
        description
        versionId
        categoryName: category
        displayName
        isActiveAction
        dateCreated
        isBlocked
        isPlanned
        isQueryable
        isVersioned
        isHiddenFromDropdowns
        isHiddenFromClusters
        isHiddenFromPathfinder
        isHiddenFromTimeline
        classifications
        unifiedSchema {
        version
        __typename
        }
        sources {
        ...VersionEventSource
        __typename
        }
        tags {
        ...Tag
        __typename
        }
        scheduledActions {
        ...ScheduledAction
        __typename
        }
        voteCount
        __typename
    }
    fragment VersionEventSource on Source {
        id
        name
        color
        versionId
        runtime {
        id
        platformId
        platformName
        __typename
        }
        destinations {
        ...VersionEventSourceDestination
        __typename
        }
        __typename
    }
    fragment VersionEventSourceDestination on Destination {
        id
        serviceId
        name
        enabledByDefault
        __typename
    }
    fragment Tag on Tag {
        id
        name
        __typename
    }
    fragment ScheduledAction on ScheduledAction {
        id
        type
        eventType
        targetDate
        loginId
        cancelationVoteCount
        __typename
    }
    fragment User on User {
        id
        firstName
        lastName
        email
        orgRole
        isActivated
        orgTeam
        __typename
    }
    fragment EventAuditAggregation on EventAuditAggregation {
        eventSchemaVersion
        validCount
        invalidCount
        __typename
    }
    fragment SimpleEventSourceReport on EventSourceReport {
        sourceName
        eventCount
        __typename
    }
`

const currentDate = new Date(Date.UTC())
const currentDateString = currentDate.toUTCString()
const previousYearDate = new Date(Date.UTC())
previousYearDate.setDate(currentDate - 365)
const previousYearDateString = previousYearDate.toUTCString()

const variables = {
    branchId: process.env.BRANCH_ID,
    branchName: process.env.BRANCH_NAME,
    dateEnd: currentDateString,
    dateStart: previousYearDateString,
    environmentId: process.env.ENV_ID,
    orgId: process.env.ORG_ID,
    versionId: process.env.VERSION_ID,
    workspaceId: process.env.WORKSPACE_ID
}

const requestHeaders = {
    'Cookie': process.env.ORG_LOGIN_COOKIE
}

const data = await request(endpoint, document, variables, requestHeaders)
console.log(JSON.stringify(data))