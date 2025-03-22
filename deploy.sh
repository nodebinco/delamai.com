rsync -avz --progress --info=progress2 ./build/* root@157.230.241.79:/root/app
rsync -avz --progress --info=progress2 package.json root@157.230.241.79:/root/app
rsync -avz --progress --info=progress2 ecosystem.config.cjs root@157.230.241.79:/root/app
rsync -avz --progress --info=progress2 .env root@157.230.241.79:/root/app

# In server
# cd /root/app
# bun install --production
# vi .env
# bun run start