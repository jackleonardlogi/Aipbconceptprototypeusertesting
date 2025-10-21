import React, { useState } from 'react';
import { motion } from 'motion/react';
import MultiSelectDropdown, { Provider } from './ui/multi-select-dropdown';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';

const MultiSelectDemo: React.FC = () => {
  const [selectedProviders, setSelectedProviders] = useState<string[]>(['chatgpt']);
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [customProviders, setCustomProviders] = useState<Provider[]>([]);

  // Handle adding a new custom provider
  const handleAddProvider = (newProvider: Provider) => {
    setCustomProviders(prev => [...prev, newProvider]);
    // Optionally auto-select the new provider
    if (isMultiSelect) {
      setSelectedProviders(prev => [...prev, newProvider.id]);
    } else {
      setSelectedProviders([newProvider.id]);
    }
  };

  const handleSelectionChange = (selected: string[]) => {
    setSelectedProviders(selected);
  };

  const handleMultiSelectToggle = () => {
    setIsMultiSelect(!isMultiSelect);
    // If switching to single-select and multiple are selected, keep only the first one
    if (!isMultiSelect && selectedProviders.length > 1) {
      setSelectedProviders([selectedProviders[0]]);
    }
  };

  const clearAll = () => {
    // Keep at least one provider selected
    setSelectedProviders(['chatgpt']);
  };

  const selectAll = () => {
    const allProviderIds = ['chatgpt', 'claude', 'copilot', 'midjourney', ...customProviders.map(p => p.id)];
    setSelectedProviders(allProviderIds);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Demo Toggle Button */}
      <motion.button
        onClick={() => setShowDemo(!showDemo)}
        className="mb-4 px-4 py-3 rounded-xl backdrop-blur-xl border"
        style={{
          background: 'linear-gradient(135deg, rgba(129, 78, 250, 0.5) 0%, rgba(129, 78, 250, 0.3) 100%)',
          borderColor: 'rgba(255, 255, 255, 0.3)',
          color: 'white',
          boxShadow: '0 8px 32px rgba(129, 78, 250, 0.3)',
          fontFamily: 'Brown Logitech Pan, sans-serif'
        }}
        whileHover={{ 
          scale: 1.05,
          boxShadow: '0 12px 40px rgba(129, 78, 250, 0.4)'
        }}
        whileTap={{ scale: 0.95 }}
      >
        {showDemo ? 'Hide' : 'Show'} Multi-Select Demo
      </motion.button>

      {/* Demo Panel */}
      {showDemo && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="w-80"
        >
          <Card 
            className="p-6 backdrop-blur-xl border"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--elevation-md)'
            }}
          >
            <div className="space-y-4">
              <div>
                <h3 
                  className="mb-2"
                  style={{ 
                    color: 'var(--foreground)',
                    fontFamily: 'Brown Logitech Pan, sans-serif'
                  }}
                >
                  AI Provider Selection
                </h3>
                <p 
                  className="caption mb-4"
                  style={{ 
                    color: 'var(--muted-foreground)',
                    fontFamily: 'Brown Logitech Pan, sans-serif'
                  }}
                >
                  Select one or more AI providers for your queries
                </p>

                {/* Multi-Select Dropdown */}
                <MultiSelectDropdown
                  providers={[
                    ...customProviders,
                    {
                      id: 'chatgpt',
                      name: 'Chat GPT',
                      icon: (
                        <div className="relative shrink-0 size-[24px]">
                          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                            <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0734a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" fill="#10A37F"/>
                          </svg>
                        </div>
                      ),
                      selected: true
                    },
                    {
                      id: 'claude',
                      name: 'Claude',
                      icon: (
                        <div className="overflow-clip relative rounded-[100px] shrink-0 size-[24px]">
                          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAASCAYAAAC5DOVpAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALjSURBVHgBjVRPSJRREJ953y7fJpRrBUEnrXQVC/9EhyjIoG4FFriKJHqIIIJsoVytwM9LuUukeelWUh1WKTIIgtK0S4eilAiWXYWsixGaW2na7ve9aZ7rp5tfigOP9968md+b+c28h7BCPpytzfFssl7ycqgg1BOw9fFLtaXokrvyr0cewioiVirc2TKbAEp5XIhfrS5atrQ6pKQrsIY4wIraI+M8DSxsUnDG1kuEzXzB56VIg/5QLOgf/mRUeh1g8eaaBjXSjngaAX6xc4NtjARbEXFErUeb/K0E2MRa38+ZjSkHGBGFedwdba4xVHSEeJPV3tS8fpFBGRu2A4o38WB1I19mpH3gcsmN+7M2BtqLaHNNriAa5GUuInwES6sjYal9FrnwAJr0Fiw6Chq+SANhV2E40phJEcIKiXFkbMlp0BcBOMVRlbG6n8cRHuPqMjUXbCjaiYYh1wRLA57cAeQeWHR0iCVhrwvlFkSxRwKWIVCxhdiFC+lJagGBE0g0DYg/kOQUEz5jCVHPUdbD6pLgeN5z0q+Yx3suz/x8IunxTDC6i4G4v1Aw+apyWQzuJSfAVwboFyB7TYExoeN3nxGZXDVNJVzVCq7uHVJVBNCXT4jbQ0zwvJ83do9Nk6DjjqbltCu4/IOS4BkhNy/CN0gTvyhYylV/7gv15JiI5UQiwFk8EaZrdiky1ZypOb1VPSM+HEqids5NZggkmZy+SiGhmpiXT7m/djNgd364ty0zkKXIkr/1U8qYDQMF7ZHDupWqAnaSQgSYw22k4QOGvM3nx4RA1bgN6iVkgv2Xs7EWf6Ul8bGJZnlx+6ORWLBaEpn79KQ1ltT1KBdrjDZoJ2COOpjXd4Xhns5/IsvgLNeUeItvbmOgYS7EoQXahXsyr7MvQRrVcsUPijlZ5QtF6vSsP92ONG3RLOHl9Dr4fRpqbxGVqHnxN4HCa72D3Pbnmfyo2ucZfQlYr0TTv8nr9dj+BX72RYsQD0CuAAAAAElFTkSuQmCC" alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" />
                        </div>
                      )
                    },
                    {
                      id: 'copilot',
                      name: 'Copilot',
                      icon: (
                        <div className="overflow-clip relative rounded-[100px] shrink-0 size-[24px]">
                          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAASCAYAAAC5DOVpAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAANNSURBVHgBdZRNaFxVFMf/9+O9N/MyiZlxWoNSOtJC0W7SheLClkAqtCulMRXRRXSpm7hx48KPpQspuBCFSkXQoEKKKNiiJVCoCNJmUWhLaTtpSkPz0Xx1Zu77uPf0vDedaZO0l3feOe+9e3/vnHPPuQKbxtAF6jcGg+2nNL86qn78Mtavz89G54av4TFDPPqwe/Leu56SXxOJfkcEysQh162Ly1j+6yY8X6JYFB/dOfXKsSfC+r+Zq2nlnecXZRCyqw1DbiCerCOwhGKooApqcebXfds2w2THsIn9NG6Zsmm1EJkWYtNEEjdh4wbs/CoKjtDT50H2B0grxerA+NWhzTCd3Z799v8wSVePCjgI4SCFZW35T207XpTwQp7a6yHpKyDt8WGL3uu8dGoLrBTMvyk8EcpNoFyzLJuBs6JQ/i7yVXIkEG/UlBpxVo9v++TuaxtifTm19o/DX5VP5LBqYfZgliUJ2/WsDc2AVL89Uzl85/Rg47/R359Pmk9PNKgEQyEiV9y7CLWX1478Njr7VA6rhLMHJHUgDgptnQM5lH9Of9zI5vVQ62gULcO5lPckYUYES5rnEDyRDOrxP8cGU3lrp8ohbZDu2Ky5TP7u5KSkmoeUa9uKUgRk4EjlMCVtrHcX53Y63imVvegCXdduxPJMtvje2JcDxqwNSenydPgUIyEvn418LV3Sz4mFsqc7AMq1fADkuvn31UNX5vLS0eZg4HPYiWPPY8TOMJJhJHMYhzCt96ilUyTSDbDMqwzIt++7216Khily8A3DkhgFy+VBWTxZ3cv69okPp/SLB2bmFs/2HglkMqLJq2jbu08YXZFNeU2c27Wevp+8U7+Bl61eG9NeCeSxd7GGYiA59ooEBImpbp1V969PsmIxoJ+Ha1h1F3A3eYHLf8LxpoXVAoIqtxafAORpUMJ5SlUb5gSkkj9uaKdus759so6VZBoNPic4pMgQgh0hZCmC7DUPpa/VkXrx2Gdnup5tGUvxSbTcULxmsbJO2L6HezJ46BWxV7CZZxxiKj/f0E5bxoL9wURufGmFanJXCP8ZywAD+FygHRiHSIn8wvvg+IluVHjC+GV0VL2kFvbX3qpu/GA0Us4ApXLFf++n6Uc/3Qdv/abIt6FQVwAAAABJRU5ErkJggg==" alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" />
                        </div>
                      )
                    },
                    {
                      id: 'gemini',
                      name: 'Gemini',
                      icon: (
                        <div className="overflow-clip relative rounded-[100px] shrink-0 size-[24px]">
                          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAASCAYAAAC5DOVpAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKXSURBVHgBpZRPSFRBHMd/8+a9N9tbXXXxD5m6puXFJEI6hLcOkZKHDgZBKV4iCiShwMpDl6DEqA6GnqJDpw4F0bFbRH8MMwjL3GXd1dB1Xfe9fb7/M9PbqEOy7lb+LvOb4fv7zG9+v5kB+Av7cnro3ucLN8pK6YRSgkxvX1PAyZ1kqnZqxzDgzlUOqEKXq/p3BNvo6YnYgnxGJWFIK3UHJ0denv8v2LfubmIS8nwtWO0slTd4yWAjTSr1V/pvZZr+GSZV4zuroaraWEXEWihvdqOBBp4Qw2FVIC+OjvNIoRi0dWH5+uFG2whOpFltZ0zc70alA5CQ2+S0XE90XClbSBI9EBJcRMdeX0aLBWF8ulNa+WgNGzoZSnlhMUpb7HnWzuK8Q1iDvQEDqgMu2kUoYEyBC5wjygGmMIOx96Mo+RM2Pd25WzScS4rBzoGLQhtu0E66Nfqc2ebGrHa2bLULm25Edr2qAAWJ+J0Vgedz4MwPN/0x449THJxnYi4ncEXBEpVx1t+1QvV8xxKJZgDWc4zZ4ILDXJEyijiT/FjE80kg/1Ac8i5k/UkaBDn7R81ezXYNaHzX6Hcn1BjV61lca2Grahvb1FvBNesE7pWJwET8q3GmgNBNMQgTb4eQVrABT2eON+tYub9khnti2h62lG1lG9l91DEaOLUrEWKK4Jcs6desd/Yami/azd92d2bg4aIePhtXm2gq2+KZuYjnmTUMvFBCZmW9H0ZQYmvMtvds+NCjQSTZM5ioiJM08kiKeSSzwLF2ohAobyIUMZOzPgvr7xySVmxXchmiY3MXO5Lb6Yu+zckjk/F16jzYxKppkbWvC4PdT4rpS/4ahiL7MH3FDqRvl9KWhH3qGk8ZyHmM6fqbUtofClUxwvh4yXQAAAAASUVORK5CYII=" alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" />
                        </div>
                      )
                    },
                    {
                      id: 'midjourney',
                      name: 'Midjourney',
                      icon: (
                        <div className="overflow-clip relative rounded-[100px] shrink-0 size-[24px]">
                          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAYCAYAAAAPtVbGAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALJSURBVHgBtVZLTBNRFD2vnZm2xgKJLJSWUjQWChUwFX8BLMaNC1DEuJaNJn6ihBBdqV0aNxpjFEP8REwoysewUzS4IBYlsUZsQRIFbFEQSEu0pa2d8c0IhqTQ8mlPMpk3707umXPvuTNDMIdAKHScgJyjyyKsGWQYEDoULGMlhHiJuBUMhy8LAq4g8ehWcmw5CQQCeiJnviJJiAikSiZj2QSUZ2kwBIdkPM+nIcmQLRVwDgyi/uIluD1jSBpJXm4OtJoMPO96hUdNNmlvcmoKqwETK2gy5SFj00aoVOvQ9LgFU9PTGB11o/b8KekBlgtZrGCxeTvs9nfQZ2lhsZRQ+wM7i82ov7CyMsYkSUlRYzY4K63FJ6+uqkQkEkFZ6V60tnXim9uDNZOIEJPOQyTSZmpgzDUgHA7jRVc3fDMz8VLEJxHoq2Ahykr2oKfHDqPRgKJCE+403IuXIjaJmJ7jFFH7FZUHoV6vpv3qg2VfKXrf9mHVJM5PA8gz5vwnnD8KTPl47/gAhVJB4wbYe2OTxLSw7UkHsrN1GBr6Ar//N3haOrmcof0IweH4iLq6M7hxs0Gy9fDICHVh1spIxBLo9ZmoPlKBFLVaUkAbhImJn5TkD7bRGfL/8sNsLkKWLhPNzW3YvCUbx44eXh6JKN/p+gyVUgmbrR2hUBCpaWnw+XxIT98AlpFTe6dCTS2u0WbA6/VRO7tRWJCPZSsR58PlGpRU7N61A56x72hr75QcdWC/RRrElpZ2BEOzVNkkxmicZTk4nQPIMWyNyhfV+P5+l3TztatWjI+P427jQ3S97MbJEzUQeODW7Ua8oa6qrT0tVg8ezw/odDrU152lqjR42vosioTMfXbvI0EQe0cWEoA8iDuMKwVZZE+mZNkOevYiSeDBv5aJfxNUpBVJAFXlUHHcv3IpOe66AKGGLh1IDLzUFFaOZcrFi79Mpf7AOMlP1AAAAABJRU5ErkJggg==" alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[4px] size-full" />
                        </div>
                      )
                    },
                    {
                      id: 'perplexity',
                      name: 'Perplexity',
                      icon: (
                        <div className="relative shrink-0 size-[24px]">
                          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" fill="#20C997"/>
                            <path d="M8 12.5c0-2.5 2-4.5 4.5-4.5S17 10 17 12.5s-2 4.5-4.5 4.5S8 15 8 12.5z" fill="white"/>
                            <path d="M10.5 11.5L13 14l5-5" stroke="#20C997" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="12" cy="12" r="3" fill="none" stroke="#20C997" strokeWidth="1"/>
                          </svg>
                        </div>
                      )
                    }
                  ]}
                  selectedProviders={selectedProviders}
                  onSelectionChange={handleSelectionChange}
                  isMultiSelect={isMultiSelect}
                  onMultiSelectToggle={handleMultiSelectToggle}
                  onAddProvider={handleAddProvider}
                  maxHeight={240}
                />
              </div>

              {/* Selected Providers Display */}
              {selectedProviders.length > 0 && (
                <div>
                  <p 
                    className="caption mb-2"
                    style={{ 
                      color: 'var(--foreground)',
                      fontFamily: 'Brown Logitech Pan, sans-serif'
                    }}
                  >
                    Selected Providers:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProviders.map((providerId) => (
                      <Badge 
                        key={providerId}
                        className="backdrop-blur-md border"
                        style={{
                          backgroundColor: 'rgba(129, 78, 250, 0.5)',
                          borderColor: 'rgba(129, 78, 250, 0.3)',
                          color: 'white',
                          fontFamily: 'Brown Logitech Pan, sans-serif'
                        }}
                      >
                        {providerId.charAt(0).toUpperCase() + providerId.slice(1)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={selectAll}
                  disabled={!isMultiSelect || selectedProviders.length === (6 + customProviders.length)}
                  size="sm"
                  className="flex-1"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primary-foreground)',
                    fontFamily: 'Brown Logitech Pan, sans-serif'
                  }}
                >
                  Select All
                </Button>
                <Button
                  onClick={clearAll}
                  disabled={selectedProviders.length <= 1}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  style={{
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)',
                    fontFamily: 'Brown Logitech Pan, sans-serif'
                  }}
                >
                  Clear
                </Button>
              </div>

              {/* Mode Display */}
              <div 
                className="p-3 rounded-lg"
                style={{
                  backgroundColor: 'var(--muted)',
                  color: 'var(--muted-foreground)',
                  fontFamily: 'Brown Logitech Pan, sans-serif'
                }}
              >
                <p className="caption">
                  Mode: {isMultiSelect ? 'Multi-Select' : 'Single-Select'}
                </p>
                <p className="caption">
                  {selectedProviders.length} of {6 + customProviders.length} providers selected
                </p>
                {customProviders.length > 0 && (
                  <p className="caption opacity-80">
                    Including {customProviders.length} custom provider{customProviders.length === 1 ? '' : 's'}
                  </p>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default MultiSelectDemo;