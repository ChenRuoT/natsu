Pod::Spec.new do |s|
  s.name = 'NatsuLink'
  s.version = '0.1.0'
  s.summary = 'Natsu direct QUIC connection'
  s.description = s.summary
  s.license = { :type => 'MIT' }
  s.author = 'Natsu'
  s.homepage = 'https://github.com/ChenRuoT/natsu'
  s.platforms = { :ios => '16.4' }
  s.source = { :git => 'https://github.com/ChenRuoT/natsu.git' }
  s.static_framework = true
  s.dependency 'ExpoModulesCore'
  s.source_files = '**/*.swift'
  s.resource_bundles = { 'NatsuTranscriptAssets' => ['Resources/transcript-artwork.json'] }
  s.vendored_frameworks = 'NatsuLinkCore.xcframework'
  s.frameworks = 'Security', 'SystemConfiguration', 'UIKit', 'CoreText'
  s.pod_target_xcconfig = { 'DEFINES_MODULE' => 'YES' }
end
