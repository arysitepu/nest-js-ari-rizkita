const Minio = require('minio')

export function minioConnection(apps_bucket_ip,apps_bucket_uname, apps_bucket_pwd): any {

	return new Minio.Client({
		endPoint: apps_bucket_ip,
		port: parseInt(process.env.MINIO_PORT),
        useSSL : false,
		accessKey: apps_bucket_uname,
		secretKey: apps_bucket_pwd
		// endPoint: 'devminio.soedarpo.id',
		// useSSL: process.env.MINIO_USESSL.toUpperCase() == "TRUE",
		// accessKey: 'PsiUser',
		// secretKey: 'dev_psi2022',
	
	});
}
