import _ from 'lodash/fp'
import PropTypes from 'prop-types'
import { b, div, h } from 'react-hyperscript-helpers'
import { buttonPrimary, spinnerOverlay } from 'src/components/common'
import ErrorView from 'src/components/ErrorView'
import { icon } from 'src/components/icons'
import Modal from 'src/components/Modal'
import { withWorkspaces, WorkspaceSelector } from 'src/components/workspace-utils'
import { ajaxCaller } from 'src/libs/ajax'
import colors from 'src/libs/colors'
import { reportError } from 'src/libs/error'
import { requiredFormLabel, formLabel } from 'src/libs/forms'
import * as Nav from 'src/libs/nav'
import * as Style from 'src/libs/style'
import * as Utils from 'src/libs/utils'
import { Component } from 'src/libs/wrapped-components'
import validate from 'validate.js'


export default _.flow(
  ajaxCaller,
  withWorkspaces()
)(class ExportDataModal extends Component {
  static propTypes = {
    onDismiss: PropTypes.func.isRequired,
    selectedEntities: PropTypes.array.isRequired,
    selectedDataType: PropTypes.string.isRequired,
    runningSubmissionsCount: PropTypes.number.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      hardConflicts: [],
      selectedWorkspaceId: undefined,
      error: undefined,
      copying: false,
      selectedEntityType: props.selectedDataType
    }
  }

  getSelectedWorkspace() {
    const { workspaces } = this.props
    const { selectedWorkspaceId } = this.state
    return _.find({ workspace: { workspaceId: selectedWorkspaceId } }, workspaces)
  }

  render() {
    const { copied } = this.state
    return copied ? this.renderPostCopy() : this.renderCopyForm()
  }

  renderCopyForm() {
    const { onDismiss, selectedEntities, runningSubmissionsCount, workspace, workspaces } = this.props
    const { copying, hardConflicts, hardConflictsExist, error, selectedWorkspaceId } = this.state

    const warningStyle = {
      border: `1px solid ${colors.orange[1]}`, borderLeft: 'none', borderRight: 'none',
      backgroundColor: colors.orange[4],
      padding: '1rem 1.25rem', margin: '0 -1.25rem',
      color: colors.orange[0], fontWeight: 'bold', fontSize: 12
    }

    const errorStyle = {
      ...warningStyle,
      border: `1px solid ${colors.red[1]}`,
      backgroundColor: colors.red[4],
      color: colors.red[0]
    }

    const errors = validate(
      { selectedWorkspaceId },
      { selectedWorkspaceId: { presence: true } },
      { prettify: v => (validate.prettify(v)) }
    )
    return h(Modal, {
      onDismiss,
      title: 'Copy to Workspace',
      okButton: buttonPrimary({
        tooltip: hardConflictsExist ? 'Override existing entities, are you sure?' : Utils.summarizeErrors(errors),
        disabled: !!errors || copying,
        onClick: () => this.copy()
      }, ['Copy'])
    }, [
      runningSubmissionsCount > 0 && div({ style: { ...warningStyle, display: 'flex', alignItems: 'center' } }, [
        icon('warning-standard', { size: 36, className: 'is-solid', style: { flex: 'none', marginRight: '0.5rem' } }),
        `WARNING: ${runningSubmissionsCount} workflows are currently running in this workspace. ` +
        'Copying the following data could cause failures if a workflow is using this data.'
      ]),
      requiredFormLabel('Destination'),
      h(WorkspaceSelector, {
        workspaces: _.filter(({ workspace: { workspaceId }, accessLevel }) => {
          return workspace.workspaceId !== workspaceId && Utils.canWrite(accessLevel)
        }, workspaces),
        value: selectedWorkspaceId,
        onChange: v => this.setState({ selectedWorkspaceId: v })
      }),
      hardConflictsExist && div({ style: { ...errorStyle, display: 'flex', alignItems: 'center' } }, [
        icon('error-standard', { size: 36, className: 'is-solid', style: { flex: 'none', marginRight: '0.5rem' } }),
        'The following entries already exist in the selected workspace. Please select CANCEL to go back or COPY to override the existing entities. '
      ]),
      formLabel('Entries selected'),
      ..._.map(([i, entity]) => div({
        style: {
          borderTop: (i === 0 && runningSubmissionsCount === 0) ? undefined : Style.standardLine,
          padding: '0.6rem 1.25rem', margin: '0 -1.25rem'
        }
      }, hardConflictsExist ? `${entity.entityName} (${entity.entityType})` : entity),
      Utils.toIndexPairs(hardConflictsExist ? hardConflicts : selectedEntities)),
      div({
        style: { ...warningStyle, textAlign: 'right', marginTop: hardConflictsExist ? '1rem' : undefined }
      }, [`${selectedEntities.length} data entries to be copied.`]),
      copying && spinnerOverlay,
      error && h(ErrorView, { error, collapses: false })
    ])
  }

  renderPostCopy() {
    const { onDismiss } = this.props
    const selectedWorkspace = this.getSelectedWorkspace().workspace

    return h(Modal, {
      title: 'Copy to Workspace',
      onDismiss,
      cancelText: 'Stay Here',
      okButton: buttonPrimary({
        onClick: () => {
          Nav.goToPath('workspace-data', {
            namespace: selectedWorkspace.namespace,
            name: selectedWorkspace.name
          })
        }
      }, ['Go to copied data'])
    }, [
      'Successfully copied data to ',
      b([selectedWorkspace.name]),
      '. Do you want to view the copied data?'
    ])
  }

  async doOverride() {
    const { onDismiss, selectedEntities, workspace, ajax: { Workspaces } } = this.props
    const { selectedEntityType } = this.state
    const selectedWorkspace = this.getSelectedWorkspace().workspace
    const entitiesToDelete = _.map(entityName => ({ entityName, entityType: selectedEntityType }), selectedEntities)
    try {
      await Workspaces.workspace(selectedWorkspace.namespace, selectedWorkspace.name).deleteEntities(entitiesToDelete)
      await Workspaces.workspace(workspace.workspace.namespace, workspace.workspace.name)
        .copyEntities(selectedWorkspace.namespace, selectedWorkspace.name, selectedEntityType, selectedEntities)
      this.setState({ copied: true })
    } catch (error) {
      reportError('Error deleting data entries', error)
      onDismiss()
    }
  }

  async copy() {
    const { onDismiss, selectedEntities, workspace, ajax: { Workspaces } } = this.props
    const { selectedEntityType, hardConflicts } = this.state
    const selectedWorkspace = this.getSelectedWorkspace().workspace
    this.setState({ copying: true })
    if (hardConflicts.length !== 0) { //hardConflicts exist, delete and replace
      this.doOverride()
    } else {
      try {
        await Workspaces.workspace(workspace.workspace.namespace, workspace.workspace.name)
          .copyEntities(selectedWorkspace.namespace, selectedWorkspace.name, selectedEntityType, selectedEntities)
        this.setState({ copied: true })
      } catch (error) {
        switch (error.status) {
          case 409:
            const { hardConflicts } = await error.json()
            this.setState({ hardConflicts, hardConflictsExist: true, copying: false })
            break
          default:
            reportError('Error copying data entries', error)
            onDismiss()
        }
      }
    }
  }
})
