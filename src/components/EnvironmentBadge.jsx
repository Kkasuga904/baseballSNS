import React from 'react'
import config from '../config/environment'
import './EnvironmentBadge.css'

const EnvironmentBadge = () => {
  if (!config.showEnvBadge || config.isProduction) {
    return null
  }
  
  return (
    <div className={`env-badge env-badge--${config.env}`}>
      {config.env.toUpperCase()}
    </div>
  )
}

export default EnvironmentBadge