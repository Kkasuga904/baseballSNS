import React from 'react'
import { Helmet } from 'react-helmet'
import config from '../config/environment'

const SEOHead = () => {
  const isNoindex = !config.isProduction
  
  return (
    <Helmet>
      {isNoindex && (
        <>
          <meta name="robots" content="noindex, nofollow" />
          <meta name="googlebot" content="noindex, nofollow" />
        </>
      )}
      
      {config.isStaging && (
        <title>BaseLog [STAGING]</title>
      )}
      
      {config.isDevelopment && (
        <title>BaseLog [DEV]</title>
      )}
    </Helmet>
  )
}

export default SEOHead