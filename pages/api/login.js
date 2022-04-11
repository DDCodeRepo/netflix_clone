import { magicAdmin } from '../../lib/magic';
import jwt from 'jsonwebtoken';
import { createNewUser, isNewUser } from '../../lib/db/hasura';
import { setTokenCookie } from '../../lib/cookie';

export default async function login(req, res){
    if(req.method==='POST')
    {
        try {
            const auth = req.headers.authorization;
            const didToken = auth ? auth.substr(7) : '';
            const metadata = await magicAdmin.users.getMetadataByToken(didToken)

            
            const token = jwt.sign({
                'issuer': metadata.issuer,
                'publicAddress': metadata.publicAddress,
                'email': metadata.email,
                "iat": Math.floor(Date.now() / 1000),
                "exp": Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60),
                "https://hasura.io/jwt/claims": {
                  "x-hasura-allowed-roles": ["user", "admin"],
                  "x-hasura-default-role": "user",
                  "x-hasura-user-id": `${metadata.issuer}`,
                },
              },
              process.env.NEXT_PUBLIC_JWT_SECRET,
              );
            console.log({ token });

            const isNewUserQuery = await isNewUser(token, metadata.issuer);

            isNewUserQuery && (await createNewUser(token, metadata));
            setTokenCookie(token, res);
            res.send({ done: true });
        } catch (err) {
            console.error('Something went wrong logging in', err);
            res.status(500).send({done:false});
        }
    } else{
        res.send({ done: false });
    }
}