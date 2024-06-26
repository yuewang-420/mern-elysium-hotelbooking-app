type StepConnectorProps = {
  isValid: boolean
}

const StepConnector = ({ isValid }: StepConnectorProps) => {
  const connectorClass = isValid
    ? 'border-green-500 bg-green-500'
    : 'border-neutral-300 bg-neutral-300'

  return <div className={`w-0 md:w-4 h-0.5 ${connectorClass} mx-2`}></div>
}

export default StepConnector
