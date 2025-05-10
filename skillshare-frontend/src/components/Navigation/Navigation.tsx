import { useNavigate } from "react-router"
import { navigationMenu } from "./NavigationMenu"
import { Avatar, Button, Menu, MenuItem } from "@mui/material";

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import React from "react";
import { useSelector } from "react-redux";


const Navigation = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    //const {auth : any} = useSelector(store => store)
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const navigate = useNavigate();
    const handleLogout = () => {
        console.log("Logout")
        handleClose()
    }
    return (
        <div className="h-screen fixed top-0 left-0 ml-[25px] w-[250px]">
            <div>
                <div className="py-5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" className="css-pgi4ag"><path fill-rule="evenodd" clip-rule="evenodd" fill="#0073E6" d="M24 5.601V1.592a.344.344 0 0 0-.514-.298l-2.64 1.508a.688.688 0 0 0-.346.597v4.009c0 .264.285.43.514.298l2.64-1.508A.688.688 0 0 0 24 5.6ZM.515 1.295l7.643 4.383a.688.688 0 0 0 .684 0l7.643-4.383a.344.344 0 0 1 .515.298v12.03c0 .235-.12.453-.319.58l-4.65 2.953 3.11 1.832c.22.13.495.127.713-.009l4.61-2.878a.344.344 0 0 0 .161-.292v-4.085c0-.254.14-.486.362-.606l2.507-1.346a.344.344 0 0 1 .506.303v7.531c0 .244-.13.47-.34.593l-7.834 4.592a.688.688 0 0 1-.71-.009l-5.953-3.681A.344.344 0 0 1 9 18.808v-3.624c0-.115.057-.222.153-.286l4.04-2.694a.688.688 0 0 0 .307-.572v-4.39a.137.137 0 0 0-.208-.117l-4.44 2.664a.688.688 0 0 1-.705.002L3.645 7.123a.138.138 0 0 0-.208.118v7.933a.344.344 0 0 1-.52.295L.5 14.019C.19 13.833 0 13.497 0 13.135V1.593c0-.264.286-.43.515-.298Z"></path></svg>
                </div>
                <div className="space-y-5">
                    {navigationMenu.map((item) => <div className="cursor-pointer flex 
                        space-x-3 items-center" onClick={() => item.title === "Profile" ? navigate(`/profile/${5}`) : navigate(item.path)}>
                        {item.icon}
                        <p className="text-x1">{item.title}</p>
                    </div>
                    )}

                </div>
                <div className="py-10">
                    <Button sx={{ width: "100%", borderRadius: "29px", py: "15px", bgcolor: "#1e88e5" }} variant="contained">
                        Tweet
                    </Button>
                </div>
            </div>
            <div className="flex-item-center justify-between">
                <div className="flex items-center space-x-3">
                    <Avatar alt="username" src="https://secure.gravatar.com/avatar/3fbe84b93407a82e024390352db2544b?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FMP-5.png" />
                </div>
                <div>
                    <span>Minsandha</span>
                    <span className="opacity-70">@mina</span>
                </div>

                <Button
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                >
                    <MoreHorizIcon />
                </Button>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>

                </Menu>
            </div>

        </div>
    )
}

export default Navigation
