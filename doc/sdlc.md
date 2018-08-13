# Saturn UI Software Development Lifecycle

## Architecture Overview

The system's responsibility is to deliver an application to a person's web browser. The application facilitates use of other services providing a variety of features. Since these external services control access to the resources they manage, this application is not involved in access control.

## Specific Controls

### Access Control Policy and Procedures [[AC-1](https://nvd.nist.gov/800-53/Rev4/control/AC-1)]

#### Roles:

* Contributing Engineer
* Primary Engineer
* Tech Lead

A **Contributing Engineer** has write access to the Saturn UI GitHub repo and can merge pull requests, causing a deploy to the Saturn UI development environment. Any software engineer can become a contributing engineer with management approval.

A **Primary Engineer** has owner privileges in the Saturn production Google project, *bvdp-saturn-prod*. These engineers can manipulate the production environment and deploy new code to production. New primary engineers must be approved by the team's engineering manager.

A **Tech Lead** is a Primary Engineer who is also responsible for reviewing the security controls and adding and removing engineers from the other roles. The tech lead is designated by the team's engineering manager.

Access to the system is public, so the system's users do not require any special privileges.

Review Frequency:

The tech lead modifies the engineers in the above roles and reviews the access controls upon any event where an engineer is added or removed from the team.

### Account Management [[AC-2](https://nvd.nist.gov/800-53/Rev4/control/AC-2)]

All accounts on the system are Google GSuite accounts in the domain of the engineer's employer. The tech lead assigns privileges to each person's account based on their role within the project. The team's engineering manager approves new assignments to project roles and informs the tech lead about team changes that require changes to role assignments.

The team's engineering manager and tech lead monitor account usage in Google Cloud Console as needed.

### Access Enforcement [[AC-3](https://nvd.nist.gov/800-53/Rev4/control/AC-3)]

Access control policy enforcement is delegated to GitHub for the repo and Google for the Google projects.

### Information Flow Enforcement [[AC-4](https://nvd.nist.gov/800-53/Rev4/control/AC-4)]

The application is delivered to the user's browser over a TSL-encrypted connection signed using Google's App Engine certificates. All connections made from the browser to external services use HTTPS connections.

### Separation of Duties [[AC-5](https://nvd.nist.gov/800-53/Rev4/control/AC-5)]

Duties are assigned and enforced based on roles defined in AC-1.

### Least Privilege [[AC-6](https://nvd.nist.gov/800-53/Rev4/control/AC-6)]

Roles assigned in AC-1 ensure the least privilege necessary for each team member. Usage monitoring is specified in AC-2. Enforcement is specified in AC-3.

### Unsuccessful Logon Attempts [[AC-7](https://nvd.nist.gov/800-53/Rev4/control/AC-7)]

Specified in AC-3.

### System Use Notification [[AC-8](https://nvd.nist.gov/800-53/Rev4/control/AC-8)]

The system displays a system use notification upon presenting the sign-in page.

### Session Lock [[AC-11](https://nvd.nist.gov/800-53/Rev4/control/AC-11)]

Specified in AC-3.

### Session Termination [[AC-12](https://nvd.nist.gov/800-53/Rev4/control/AC-12)]

Specified in AC-3.

### Permitted Actions without Identification or Authentication [[AC-14](https://nvd.nist.gov/800-53/Rev4/control/AC-14)]

Access to the system is public.

### Remote Access [[AC-17](https://nvd.nist.gov/800-53/Rev4/control/AC-17)]

The system is designed to be accessed from any internet connection.

### Wireless Access [[AC-18](https://nvd.nist.gov/800-53/Rev4/control/AC-18)]

Connection quality does not impact information flow enforcement specified in AC-4.

### Access Control for Mobile Devices [[AC-19](https://nvd.nist.gov/800-53/Rev4/control/AC-19)]

Information available on a mobile device is limited to what is stored by the web browser on such devices.

### Use of External Information Systems [[AC-20](https://nvd.nist.gov/800-53/Rev4/control/AC-20)]

The system does not establish connections with external systems for which an organizational relationship does not already exist.

### Information Sharing [[AC-21](https://nvd.nist.gov/800-53/Rev4/control/AC-21)]

???

### Publicly Accessible Content [[AC-22](https://nvd.nist.gov/800-53/Rev4/control/AC-22)]

The system does not store user content.

### Security Awareness and Training Policy and Procedures [[AT-1](https://nvd.nist.gov/800-53/Rev4/control/AT-1)]

All roles defined in AC-1 must complete at least one security training class each year. Individuals who have not taken a class in the basics of security design, development, and testing must do so. At least 80 percent of team must be in compliance with this standard. The engineering manager reviews and updates this policy as needed.

### Security Awareness and Training [[AT-2](https://nvd.nist.gov/800-53/Rev4/control/AT-2)]

Training package specified in AT-1 includes insider threat awareness.

### Role-Based Security Training [[AT-3](https://nvd.nist.gov/800-53/Rev4/control/AT-3)]

All training material is applicable to all project roles.

### Security Training Records [[AT-4](https://nvd.nist.gov/800-53/Rev4/control/AT-4)]

Security training records are retained by the organization.

### Audit and Accountability Policy and Procedures [[AU-1](https://nvd.nist.gov/800-53/Rev4/control/AU-1)]

TODO: Link to organizational documentation regarding accountability policy.

### Audit Events [[AU-2](https://nvd.nist.gov/800-53/Rev4/control/AU-2)]

All modifications to the system by the roles defined in AC-1 is logged and available in [Google Cloud Console Activity](https://console.cloud.google.com/home/activity). All access to the system from the public is logged and available in [Google Cloud Console Log Viewer](https://console.cloud.google.com/logs/viewer).

### Content of Audit Records [[AU-3](https://nvd.nist.gov/800-53/Rev4/control/AU-3)]

Content is controlled by the logging systems specified in AU-2.

### Audit Storage Capacity [[AU-4](https://nvd.nist.gov/800-53/Rev4/control/AU-4)]

Audit storage capacity is controlled by the logging systems specified in AU-2.

### Response to Audit Processing Failures [[AU-5](https://nvd.nist.gov/800-53/Rev4/control/AU-5)]

Audit processing failures are processed by the logging systems specified in AU-2.

### Audit Review, Analysis, And Reporting [[AU-6](https://nvd.nist.gov/800-53/Rev4/control/AU-6)]

Audit logs are reviewed as needed by the engineering manager.

### Audit Reduction And Report Generation [[AU-7](https://nvd.nist.gov/800-53/Rev4/control/AU-7)]

Audit reports are generated by the systems specified in AU-2.

### Time Stamps [[AU-8](https://nvd.nist.gov/800-53/Rev4/control/AU-8)]

Time stamps are generated by the systems specified in AU-2.

### Protection of Audit Information [[AU-9](https://nvd.nist.gov/800-53/Rev4/control/AU-9)]

Access to audit information is controlled by the systems specified in AU-2.

### Audit Record Retention [[AU-11](https://nvd.nist.gov/800-53/Rev4/control/AU-11)]

Audit record retention is controlled by the systems specified in AU-2.

### Audit Generation [[AU-12](https://nvd.nist.gov/800-53/Rev4/control/AU-12)]

Audit records are generated by the systems specified in AU-2.