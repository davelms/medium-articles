# Ensure our service is enabled

if [ $1 -eq 1 ] ; then 
  # Initial installation 
  systemctl enable demo-application.service >/dev/null 2>&1 || : 
fi